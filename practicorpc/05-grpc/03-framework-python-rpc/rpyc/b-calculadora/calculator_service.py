from rpyc import Service
from rpyc.utils.server import ThreadedServer


class CalculatorService(Service):
    def exposed_suma(self, op1: int, op2: int) -> int:
        result = op1 + op2
        print(f"suma({op1}, {op2}) = {result}", flush=True)
        return result

    def exposed_resta(self, op1: int, op2: int) -> int:
        result = op1 - op2
        print(f"resta({op1}, {op2}) = {result}", flush=True)
        return result

    def exposed_divide(self, op1: int, op2: int) -> int:
        if op2 == 0:
            raise ValueError("No se puede dividir por cero")
        result = op1 // op2
        print(f"divide({op1}, {op2}) = {result}", flush=True)
        return result

    def exposed_multiplica(self, op1: int, op2: int) -> int:
        result = op1 * op2
        print(f"multiplica({op1}, {op2}) = {result}", flush=True)
        return result


if __name__ == "__main__":
    server = ThreadedServer(CalculatorService, port=18862)
    print("CalculatorService (RPyC) escuchando en puerto 18862", flush=True)
    server.start()
