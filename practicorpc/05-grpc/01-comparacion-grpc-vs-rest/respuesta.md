# gRPC 1) Comparar gRPC con REST

## gRPC

- contrato formal con `.proto`
- binario (Protobuf), más compacto
- muy bueno para baja latencia y comunicación servicio a servicio
- soporta unary y streaming
- genera stubs automáticamente

## REST

- usa HTTP con recursos y verbos (`GET`, `POST`, etc.)
- normalmente JSON, más legible para humanos
- más simple de inspeccionar con navegador, Postman o `curl`
- ideal para APIs públicas y frontends web

## Resumen corto

- **REST** gana en simplicidad, compatibilidad universal y debugging manual.
- **gRPC** gana en contrato fuerte, performance y tipado.
