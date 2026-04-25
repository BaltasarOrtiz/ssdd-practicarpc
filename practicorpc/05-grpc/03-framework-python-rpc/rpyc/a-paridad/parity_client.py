import rpyc
import sys


def main() -> None:
    if sys.stdin.isatty():
        sys.stdout.write("Ingresá un número: ")
        sys.stdout.flush()
    numero = int(sys.stdin.readline())
    connection = rpyc.connect("localhost", 18861)
    try:
        print("Resultado:", connection.root.es_par_o_impar(numero))
    finally:
        connection.close()


if __name__ == "__main__":
    main()
