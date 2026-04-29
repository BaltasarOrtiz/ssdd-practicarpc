from rpyc import Service
from rpyc.utils.server import ThreadedServer


class ParityService(Service):
    def exposed_es_par_o_impar(self, numero: int) -> str:
        result = "par" if numero % 2 == 0 else "impar"
        print(f"es_par_o_impar({numero}) = {result}", flush=True)
        return result


if __name__ == "__main__":
    server = ThreadedServer(ParityService, port=18861)
    print("ParityService (RPyC) escuchando en puerto 18861", flush=True)
    server.start()
