import serial
import struct
import threading
import time
from flask import Flask, jsonify
from flask_socketio import SocketIO
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

SERIAL_PORT = 'COM4'
BAUD_RATE = 115200
SAMPLE_WINDOW = 100

app = Flask(__name__)
socketio = SocketIO(app)

try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
except Exception as e:
    print(f"Failed to open serial port: {e}")
    exit()

temp_data = [0] * SAMPLE_WINDOW
time_data = list(range(SAMPLE_WINDOW))

def read_binary_packet():
    try:
        raw = ser.read(6)
        if len(raw) == 6:
            header, packet_num, data = struct.unpack('<HHh', raw)
            if header == 0xAAAB:
                return packet_num, data
    except Exception as e:
        print(f"Error reading binary packet: {e}")
    return None, None

def update_temperature_data():
    global temp_data
    while True:
        packet_num, temperature = read_binary_packet()
        if temperature is not None:
            print(f"Packet: {packet_num}, Temp: {temperature}")

            temp_data.append(temperature)
            if len(temp_data) > SAMPLE_WINDOW:
                temp_data.pop(0)

            socketio.emit('new_data', {'temperature': temperature, 'time': time.time()})
        
        time.sleep(0.1)

@app.route('/data', methods=['GET'])
def get_data():
    return jsonify({'temperature_data': temp_data, 'time_data': time_data})

fig, ax = plt.subplots()
ax.set_xlim(0, SAMPLE_WINDOW)
ax.set_ylim(-41, 86)
line, = ax.plot(time_data, temp_data, label="Temperature", color='red')

plt.title("Temperature Data in Real-Time")
plt.xlabel("Samples")
plt.ylabel("Temperature (Raw Units)")
plt.legend()
plt.grid()

def update_plot(frame):
    global temp_data

    line.set_ydata(temp_data)
    
    return line,

def start_background_thread():
    thread = threading.Thread(target=update_temperature_data)
    thread.daemon = True
    thread.start()

def start_plot_animation():
    ani = FuncAnimation(fig, update_plot, interval=100)
    plt.show()

if __name__ == '__main__':
    start_background_thread()
    threading.Thread(target=start_plot_animation, daemon=True).start()
    socketio.run(app, host='0.0.0.0', port=5000)
