import serial
import struct
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

SERIAL_PORT = 'COM4'
BAUD_RATE = 115200
SAMPLE_WINDOW = 100

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

def update(frame):
    global temp_data

    packet_num, temperature = read_binary_packet()
    if temperature is not None:
        print(f"Packet: {packet_num}, Temp: {temperature}")

        temp_data.append(temperature)
        if len(temp_data) > SAMPLE_WINDOW:
            temp_data.pop(0)

        line.set_ydata(temp_data)

    return line

fig, ax = plt.subplots()
ax.set_xlim(0, SAMPLE_WINDOW)
ax.set_ylim(-41, 86)
line, = ax.plot(time_data, temp_data, label="Temperature", color='red')

plt.title("Temperature Data in Real-Time")
plt.xlabel("Samples")
plt.ylabel("Temperature (Raw Units)")
plt.legend()
plt.grid()

ani = FuncAnimation(fig, update, interval=100)

try:
    plt.show()
finally:
    ser.close()
    print("Serial port closed.")
