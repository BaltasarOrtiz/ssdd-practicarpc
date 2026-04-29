from concurrent import futures

import grpc

from generated import calculator_pb2
from generated import calculator_pb2_grpc


class CalculatorService(calculator_pb2_grpc.CalculatorServiceServicer):
    def Sum(self, request, context):
        return calculator_pb2.BinaryOperationResponse(result=request.op1 + request.op2)

    def Subtract(self, request, context):
        return calculator_pb2.BinaryOperationResponse(result=request.op1 - request.op2)

    def Divide(self, request, context):
        if request.op2 == 0:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, "No se puede dividir por cero")
        return calculator_pb2.BinaryOperationResponse(result=request.op1 // request.op2)

    def Multiply(self, request, context):
        return calculator_pb2.BinaryOperationResponse(result=request.op1 * request.op2)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    calculator_pb2_grpc.add_CalculatorServiceServicer_to_server(CalculatorService(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    print("CalculatorService gRPC escuchando en puerto 50051", flush=True)
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
