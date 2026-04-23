# Resolución completa — índice general

Ahora la resolución está segmentada **1:1 según el enunciado del práctico**.

## Estructura principal

- `../00-enunciado-y-fuentes/` → enunciado y PDFs base
- `../01-invocacion-remota-rpc/` → ejercicios 1 al 9
- `../02-json/` → ejercicios 10 al 15
- `../03-programacion-rpc/` → Programación RPC clásica
- `../04-java-rmi/` → Práctico Java RMI
- `../05-grpc/` → gRPC
- `../98-tui-practica/` → TUI para preparar y ejecutar la parte práctica

## Idea de lectura

Si querés seguir el práctico en orden, recorré las carpetas numeradas y sus subcarpetas por inciso.

## Nota sobre el entorno

Durante la resolución se verificó que en este workspace:

- hay Python, Java y Node.js,
- pero **no** había `rpcgen`, `rpcinfo` ni `protoc` globales.

Por eso:

- Sun RPC quedó listo para correr en Linux con `rpcgen`;
- Protobuf se validó y generó con Python + `grpcio-tools`;
- gRPC quedó preparado con `proto`, server y client separados.

## Archivo recomendado

El punto de entrada más importante ahora es el árbol segmentado por enunciado, no este resumen.
