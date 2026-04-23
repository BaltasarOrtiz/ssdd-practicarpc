import rpyc


def main() -> None:
    numero = int(input("Ingresá un número: "))
    connection = rpyc.connect("localhost", 18861)
    try:
        print("Resultado:", connection.root.es_par_o_impar(numero))
    finally:
        connection.close()


if __name__ == "__main__":
    main()
