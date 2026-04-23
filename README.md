# ssdd-practicarpc

Resolución del práctico de **Sistemas Distribuidos — Invocación Remota / RPC**.

## Estructura principal

- `invocacion-remota00.pdf` — teoría base de invocación remota
- `invocacion-remota01.pdf` — teoría base de RPC
- `practicorpc/Práctico_RPC_2026.md` — enunciado del práctico
- `practicorpc/RESOLUCION_COMPLETA.md` — resolución consolidada

### Entregables por tema

- `practicorpc/sockets/` — ejercicio cliente/servidor con sockets
- `practicorpc/json/` — JSON, parse/stringify y validación
- `practicorpc/protobuf/` — archivos `.proto`, validación Python y generados `_pb2.py`
- `practicorpc/rpc/` — contratos y clientes base para Sun RPC / `rpcgen`
- `practicorpc/java-rmi/` — ejercicios resueltos en Java RMI
- `practicorpc/grpc/` — ejercicios resueltos en gRPC
- `practicorpc/python-rpc-rpyc/` — ejercicios RPC en Python con RPyC

## Validaciones realizadas

- JSON validado localmente con Node.js.
- Protobuf validado con Python + `grpcio-tools`.
- Lógica del ejercicio de sockets probada localmente.

## Nota importante del entorno

Este repo fue preparado en Windows y **no** tenía instalados globalmente `rpcgen`, `rpcinfo` ni `protoc`.

Por eso:

- para Protobuf se usa `.venv` + `grpcio-tools`
- para Sun RPC quedaron fuentes e instrucciones listas para correr en Linux
- para gRPC quedaron `proto`, clientes/servidores e instrucciones de generación

