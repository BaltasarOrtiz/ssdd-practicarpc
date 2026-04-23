# README de ejecución final

Este archivo deja los **comandos exactos** que sí funcionaron en este entorno para ejecutar los incisos prácticos del trabajo.

## Requisitos del entorno

- Java 21+
- Node.js
- `rpcgen`
- `rpcinfo`
- `protoc`
- `libtirpc-dev`
- `python3-venv`

## Preparación previa

Desde la raíz del repo:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install protobuf grpcio grpcio-tools rpyc
```

## 1) Sockets — siguiente primo

### Servidor

```bash
cd practicorpc/01-invocacion-remota-rpc/01-sockets-siguiente-primo
python3 next_prime_server.py
```

### Cliente

```bash
cd practicorpc/01-invocacion-remota-rpc/01-sockets-siguiente-primo
python3 next_prime_client.py
```

## 7) Python `calcsize`

```bash
cd practicorpc/01-invocacion-remota-rpc/07-python-calcsize
python3 calcsize_check.py
```

## 9) `rpcinfo`

```bash
rpcinfo -p localhost
```

## 13) Validación JSON

```bash
cd practicorpc/02-json/13-validacion-jsonlint
node validar_json.js
```

## 14) `JSON.parse()` y `JSON.stringify()`

```bash
cd practicorpc/02-json/14-json-parse-y-stringify
node parse_stringify_examples.js
```

## 15) Protobuf

Con el virtualenv activado:

```bash
cd practicorpc/02-json/15-protobuf
../../.venv/bin/python validate_protos.py
```

Si estás parado en la raíz del repo, usá mejor:

```bash
.venv/bin/python practicorpc/02-json/15-protobuf/validate_protos.py
```

## Programación RPC clásica

### a) Par o impar

#### Compilar

```bash
cd practicorpc/03-programacion-rpc/a-par-o-impar
gcc -o paridad_server paridad_rpc_svc.c paridad_server_impl.c -ltirpc -I/usr/include/tirpc
gcc -o paridad_client paridad_rpc_clnt.c paridad_client.c -ltirpc -I/usr/include/tirpc
```

#### Ejecutar

Servidor:

```bash
cd practicorpc/03-programacion-rpc/a-par-o-impar
./paridad_server
```

Cliente:

```bash
cd practicorpc/03-programacion-rpc/a-par-o-impar
./paridad_client localhost
```

### b) Calculadora

#### Compilar

```bash
cd practicorpc/03-programacion-rpc/b-calculadora
gcc -o calculadora_server calculadora_rpc_svc.c calculadora_rpc_xdr.c calculadora_server_impl.c -ltirpc -I/usr/include/tirpc
gcc -o calculadora_client calculadora_rpc_clnt.c calculadora_rpc_xdr.c calculadora_client.c -ltirpc -I/usr/include/tirpc
```

#### Ejecutar

Servidor:

```bash
cd practicorpc/03-programacion-rpc/b-calculadora
./calculadora_server
```

Cliente:

```bash
cd practicorpc/03-programacion-rpc/b-calculadora
./calculadora_client localhost
```

## Java RMI

### Compilación

Paridad:

```bash
cd practicorpc/04-java-rmi/b-paridad-y-calculadora/paridad
mkdir -p out
javac -d out src/ar/edu/ssdd/rmi/paridad/*.java
```

Calculadora:

```bash
cd practicorpc/04-java-rmi/b-paridad-y-calculadora/calculadora
mkdir -p out
javac -d out src/ar/edu/ssdd/rmi/calculadora/*.java
```

Estaciones:

```bash
cd practicorpc/04-java-rmi/d-estaciones
mkdir -p out
javac -d out src/ar/edu/ssdd/rmi/estaciones/*.java
```

Materias:

```bash
cd practicorpc/04-java-rmi/e-materias-por-dia
mkdir -p out
javac -d out src/ar/edu/ssdd/rmi/materias/*.java
```

### Ejecución

#### Paridad

Servidor:

```bash
cd practicorpc/04-java-rmi/b-paridad-y-calculadora/paridad
java -cp out ar.edu.ssdd.rmi.paridad.ParityServer
```

Cliente:

```bash
cd practicorpc/04-java-rmi/b-paridad-y-calculadora/paridad
java -cp out ar.edu.ssdd.rmi.paridad.ParityClient localhost
```

#### Calculadora

Servidor:

```bash
cd practicorpc/04-java-rmi/b-paridad-y-calculadora/calculadora
java -cp out ar.edu.ssdd.rmi.calculadora.CalculatorServer
```

Cliente:

```bash
cd practicorpc/04-java-rmi/b-paridad-y-calculadora/calculadora
java -cp out ar.edu.ssdd.rmi.calculadora.CalculatorClient localhost
```

#### Estaciones

Servidor:

```bash
cd practicorpc/04-java-rmi/d-estaciones
java -cp out ar.edu.ssdd.rmi.estaciones.SeasonServer
```

Cliente:

```bash
cd practicorpc/04-java-rmi/d-estaciones
java -cp out ar.edu.ssdd.rmi.estaciones.SeasonClient localhost
```

#### Materias

Servidor:

```bash
cd practicorpc/04-java-rmi/e-materias-por-dia
java -cp out ar.edu.ssdd.rmi.materias.ScheduleServer
```

Cliente:

```bash
cd practicorpc/04-java-rmi/e-materias-por-dia
java -cp out ar.edu.ssdd.rmi.materias.ScheduleClient localhost
```

## gRPC

### Instalar cliente Node

```bash
cd practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/node-client
npm install
```

### Generar stubs Python

Desde la raíz del repo:

```bash
.venv/bin/python -m grpc_tools.protoc -I./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos --python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated --grpc_python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated ./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos/calculator.proto

.venv/bin/python -m grpc_tools.protoc -I./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos --python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated --grpc_python_out=./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server/generated ./practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/protos/season.proto
```

### Ejecutar calculadora gRPC

Servidor:

```bash
cd practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server
PYTHONPATH="$(pwd)/generated" ../../../../.venv/bin/python calculator_server.py
```

Cliente:

```bash
cd practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/node-client
node calculator_client.js
```

### Ejecutar estaciones gRPC

Servidor:

```bash
cd practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/python-server
PYTHONPATH="$(pwd)/generated" ../../../../.venv/bin/python season_server.py
```

Cliente:

```bash
cd practicorpc/05-grpc/02-java-rmi-b-y-d-en-grpc/node-client
node season_client.js
```

## Framework Python RPC — RPyC

### Paridad

Servidor:

```bash
cd practicorpc/05-grpc/03-framework-python-rpc/rpyc/a-paridad
../../../../../.venv/bin/python parity_service.py
```

Cliente:

```bash
cd practicorpc/05-grpc/03-framework-python-rpc/rpyc/a-paridad
../../../../../.venv/bin/python parity_client.py
```

### Calculadora

Servidor:

```bash
cd practicorpc/05-grpc/03-framework-python-rpc/rpyc/b-calculadora
../../../../../.venv/bin/python calculator_service.py
```

Cliente:

```bash
cd practicorpc/05-grpc/03-framework-python-rpc/rpyc/b-calculadora
../../../../../.venv/bin/python calculator_client.py
```

## Notas finales

- Los incisos teóricos siguen resueltos en sus archivos `.md` correspondientes.
- Para gRPC en Python, en este repo conviene usar `PYTHONPATH` porque los imports generados no son relativos.
- En Java RMI, corré **un servidor por vez** porque todos levantan registry en `1099`.
