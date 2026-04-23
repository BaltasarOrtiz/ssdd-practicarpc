from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

from google.protobuf import descriptor_pb2


BASE_DIR = Path(__file__).resolve().parent
PROTO_FILES = [
    BASE_DIR / "10-alumnos" / "alumnos.proto",
    BASE_DIR / "11-inventario" / "inventario_informatica.proto",
]


def validate_proto(proto_path: Path) -> None:
    descriptor_path = proto_path.with_suffix(".desc")

    with tempfile.TemporaryDirectory(prefix="proto-validate-") as tmpdir:
        tmpdir_path = Path(tmpdir)
        descriptor_file = tmpdir_path / descriptor_path.name

        command = [
            sys.executable,
            "-m",
            "grpc_tools.protoc",
            f"-I{BASE_DIR}",
            f"--python_out={tmpdir}",
            f"--descriptor_set_out={descriptor_file}",
            str(proto_path),
        ]

        completed = subprocess.run(
            command,
            capture_output=True,
            text=True,
            cwd=BASE_DIR,
        )

        if completed.returncode != 0:
            raise RuntimeError(
                f"Validación fallida para {proto_path.name}\n"
                f"STDOUT:\n{completed.stdout}\n"
                f"STDERR:\n{completed.stderr}"
            )

        descriptor_set = descriptor_pb2.FileDescriptorSet()
        descriptor_set.ParseFromString(descriptor_file.read_bytes())

        relative_proto = proto_path.relative_to(BASE_DIR)
        normalized_parent = Path(
            *[part.replace("-", "_") for part in relative_proto.parent.parts]
        )
        generated_module = tmpdir_path / normalized_parent / f"{proto_path.stem}_pb2.py"
        if not generated_module.exists():
            raise RuntimeError(
                f"grpc_tools.protoc terminó sin error, pero no generó {generated_module.name}"
            )

        print(f"OK: {proto_path.name}")
        for file_descriptor in descriptor_set.file:
            print(f"  package: {file_descriptor.package}")
            if file_descriptor.message_type:
                print("  mensajes:")
                for message in file_descriptor.message_type:
                    print(f"    - {message.name}")
            else:
                print("  mensajes: ninguno")


def main() -> int:
    print("Iniciando validación Protobuf con Python...\n")

    for proto_file in PROTO_FILES:
        validate_proto(proto_file)
        print()

    print("Validación completada correctamente.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
