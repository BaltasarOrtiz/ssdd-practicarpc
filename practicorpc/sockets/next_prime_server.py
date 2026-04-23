import socket


HOST = "127.0.0.1"
PORT = 5000


def is_prime(number: int) -> bool:
    if number < 2:
        return False
    if number == 2:
        return True
    if number % 2 == 0:
        return False

    divisor = 3
    while divisor * divisor <= number:
        if number % divisor == 0:
            return False
        divisor += 2
    return True


def next_prime(number: int) -> int:
    candidate = number + 1
    while not is_prime(candidate):
        candidate += 1
    return candidate


def handle_client(connection: socket.socket) -> None:
    with connection:
        data = b""
        while not data.endswith(b"\n"):
            chunk = connection.recv(1024)
            if not chunk:
                return
            data += chunk

        try:
            number = int(data.decode("utf-8").strip())
            result = next_prime(number)
            response = f"{result}\n"
        except ValueError:
            response = "ERROR: debe enviar un número entero\n"

        connection.sendall(response.encode("utf-8"))


def main() -> None:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind((HOST, PORT))
        server.listen()
        print(f"Servidor escuchando en {HOST}:{PORT}")

        while True:
            connection, address = server.accept()
            print(f"Conexión aceptada desde {address[0]}:{address[1]}")
            handle_client(connection)


if __name__ == "__main__":
    main()
