import socket


HOST = "127.0.0.1"
PORT = 5000


def main() -> None:
    raw_number = input("Ingresá un número entero: ").strip()

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as client:
        client.connect((HOST, PORT))
        client.sendall(f"{raw_number}\n".encode("utf-8"))

        data = b""
        while not data.endswith(b"\n"):
            chunk = client.recv(1024)
            if not chunk:
                break
            data += chunk

    response = data.decode("utf-8").strip()
    print(f"Respuesta del servidor: {response}")


if __name__ == "__main__":
    main()
