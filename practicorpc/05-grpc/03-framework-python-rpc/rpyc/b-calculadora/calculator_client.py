import rpyc


def main() -> None:
    opcion = input("Operación (suma, resta, divide, multiplica): ").strip().lower()
    op1 = int(input("Operando 1: "))
    op2 = int(input("Operando 2: "))

    connection = rpyc.connect("localhost", 18862)
    try:
        match opcion:
            case "suma":
                result = connection.root.suma(op1, op2)
            case "resta":
                result = connection.root.resta(op1, op2)
            case "divide":
                result = connection.root.divide(op1, op2)
            case "multiplica":
                result = connection.root.multiplica(op1, op2)
            case _:
                raise ValueError("Operación inválida")

        print("Resultado:", result)
    finally:
        connection.close()


if __name__ == "__main__":
    main()
