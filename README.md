# ssdd-practicarpc

Resolución del práctico de **Sistemas Distribuidos — Invocación Remota / RPC** organizada **según el enunciado**.

## Estructura principal

- `practicorpc/00-enunciado-y-fuentes/` — enunciado y PDFs base
- `practicorpc/01-invocacion-remota-rpc/` — ejercicios 1 al 9
- `practicorpc/02-json/` — ejercicios 10 al 15
- `practicorpc/03-programacion-rpc/` — Programación RPC clásica
- `practicorpc/04-java-rmi/` — práctico Java RMI
- `practicorpc/05-grpc/` — práctico gRPC
- `practicorpc/98-tui-practica/` — TUI para preparar y ejecutar la parte práctica
- `practicorpc/99-resumen-general/` — índice general y resumen

## Criterio de organización

Cada carpeta sigue el orden del práctico:

- número o inciso del enunciado
- archivos de código asociados
- `respuesta.md`, `analisis.md` o `README.md` cuando corresponde

## Validaciones realizadas

- JSON validado localmente con Node.js.
- Protobuf validado con Python + `grpcio-tools`.
- Módulos `_pb2.py` generados para Python.
- Lógica del ejercicio de sockets probada localmente.

## Nota importante del entorno

Este repo fue preparado en Windows y no tenía instalados globalmente `rpcgen`, `rpcinfo` ni `protoc`.

Por eso:

- Protobuf se resuelve con `.venv` + `grpcio-tools`.
- Sun RPC quedó listo para correr en Linux con `rpcgen`.
- gRPC quedó preparado con `proto`, server y client, además de instrucciones de generación.
