# Protobuf

## Archivos

- `alumnos.proto`
- `inventario_informatica.proto`
- `generated/` → módulos `_pb2.py` generados para Python

## Validación con Python

En esta carpeta ahora hay validación real con Python usando `grpcio-tools`, sin depender de un `protoc` global instalado en el sistema.

### 1) Crear entorno virtual

```bash
python -m venv .venv
```

### 2) Instalar dependencias

#### Windows PowerShell

```powershell
& ".\.venv\Scripts\python.exe" -m pip install -r requirements.txt
```

#### Linux/macOS

```bash
.venv/bin/python -m pip install -r requirements.txt
```

### 3) Ejecutar validación

#### Windows PowerShell

```powershell
& ".\.venv\Scripts\python.exe" .\validate_protos.py
```

#### Linux/macOS

```bash
.venv/bin/python validate_protos.py
```

La validación hace dos cosas:

- compila cada `.proto` con `python -m grpc_tools.protoc`
- genera un descriptor temporal y verifica que exista el módulo Python `_pb2.py`

## Nota del entorno actual

En esta máquina no estaba instalado `protoc` globalmente, así que la validación se resolvió con Python dentro de `.venv`.

## Ejemplo de generación

```bash
protoc --python_out=. alumnos.proto
protoc --python_out=. inventario_informatica.proto
```

Para Node.js:

```bash
protoc --js_out=import_style=commonjs,binary:. alumnos.proto
protoc --js_out=import_style=commonjs,binary:. inventario_informatica.proto
```

## Archivos nuevos de soporte

- `validate_protos.py`
- `requirements.txt`
- `.gitignore`
- `generated/__init__.py`
