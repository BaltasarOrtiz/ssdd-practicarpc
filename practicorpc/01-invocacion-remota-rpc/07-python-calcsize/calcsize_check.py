import platform
import struct
import sys


FORMATS = [
    "@lhl",
    "@llh",
    "<qqh6x",
    "@llh0l",
]


def main() -> None:
    print("Arquitectura:", platform.architecture())
    print("sys.maxsize:", sys.maxsize)
    for fmt in FORMATS:
        print(f"calcsize('{fmt}') = {struct.calcsize(fmt)}")


if __name__ == "__main__":
    main()
