from concurrent import futures

import grpc

from generated import season_pb2
from generated import season_pb2_grpc


class SeasonService(season_pb2_grpc.SeasonServiceServicer):
    def GetSeason(self, request, context):
        value = request.month * 100 + request.day

        if value >= 1221 or value <= 320:
            season = "Verano"
        elif 321 <= value <= 620:
            season = "Otoño"
        elif 621 <= value <= 920:
            season = "Invierno"
        else:
            season = "Primavera"

        print(f"GetSeason(day={request.day}, month={request.month}) = {season}", flush=True)
        return season_pb2.SeasonResponse(season=season, message=f"Hola {season}")


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    season_pb2_grpc.add_SeasonServiceServicer_to_server(SeasonService(), server)
    server.add_insecure_port("[::]:50052")
    server.start()
    print("SeasonService gRPC escuchando en puerto 50052", flush=True)
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
