from rpyc import Service
from rpyc.utils.server import ThreadedServer


class CalculatorService(Service):
    def exposed_suma(self, op1: int, op2: int) -> int:
        return op1 + op2

    def exposed_resta(self, op1: int, op2: int) -> int:
        return op1 - op2

    def exposed_divide(self, op1: int, op2: int) -> int:
        if op2 == 0:
            raise ValueError("No se puede dividir por cero")
        return op1 // op2

    def exposed_multiplica(self, op1: int, op2: int) -> int:
        return op1 * op2


if __name__ == "__main__":
    server = ThreadedServer(CalculatorService, port=18862)
    print("CalculatorService (RPyC) escuchando en puerto 18862")
    server.start()
