# 15) Protobuf — primeros dos ejercicios de JSON

## Estructura

- `10-alumnos/`
  - `alumnos.proto`
  - `generated/alumnos_pb2.py`
- `11-inventario/`
  - `inventario_informatica.proto`
  - `generated/inventario_informatica_pb2.py`
- `validate_protos.py`
- `requirements.txt`

## Validación con Python

La validación se hace con `grpcio-tools`, sin depender de un `protoc` global instalado en el sistema.

### Crear entorno virtual

```bash
python -m venv .venv
```

### Instalar dependencias

#### Windows PowerShell

```powershell
& ".\.venv\Scripts\python.exe" -m pip install -r requirements.txt
```

#### Linux/macOS

```bash
.venv/bin/python -m pip install -r requirements.txt
```

### Ejecutar validación

#### Windows PowerShell

```powershell
& ".\.venv\Scripts\python.exe" .\validate_protos.py
```

#### Linux/macOS

```bash
.venv/bin/python validate_protos.py
```

La validación compila cada `.proto`, genera un descriptor temporal y verifica que exista el módulo `_pb2.py` correspondiente.
