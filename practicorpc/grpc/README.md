# gRPC

## Objetivo resuelto

- **Calculadora** (`b` de Java RMI) → server Python, client Node.js
- **Estaciones** (`d` de Java RMI) → server Python, client Node.js

## Estructura

- `protos/`
- `python-server/`
- `node-client/`

## Dependencias sugeridas

### Python

```bash
pip install grpcio grpcio-tools
```

### Node.js

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

## Generación de código Python

Desde `practicorpc/grpc/`:

```bash
python -m grpc_tools.protoc -I./protos --python_out=./python-server/generated --grpc_python_out=./python-server/generated ./protos/calculator.proto
python -m grpc_tools.protoc -I./protos --python_out=./python-server/generated --grpc_python_out=./python-server/generated ./protos/season.proto
```

## Ejecución

### Servidores Python

```bash
python python-server/calculator_server.py
python python-server/season_server.py
```

### Clientes Node.js

```bash
node node-client/calculator_client.js
node node-client/season_client.js
```

## Nota del entorno actual

En este workspace no está instalado `protoc`, así que quedaron preparados los `.proto`, el código del server y el cliente, y los comandos de generación.
