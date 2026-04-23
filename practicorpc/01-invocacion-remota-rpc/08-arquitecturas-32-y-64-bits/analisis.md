# 8) Valores en 32 y 64 bits: análisis

Acá la clave es entender la ABI y cómo `struct` usa tamaños/alineación nativos cuando se trabaja con `@`.

## 32 bits típico

Normalmente:

- `long = 4 bytes`
- `short = 2 bytes`
- alineación de `long = 4`

Resultados esperables:

- `@lhl` → `12`
- `@llh` → `10`
- `<qqh6x` → `24`
- `@llh0l` → `12`

## 64 bits tipo LP64 (Linux/macOS usual)

Normalmente:

- `long = 8 bytes`
- `short = 2 bytes`
- alineación de `long = 8`

Resultados:

- `@lhl` → `24`
- `@llh` → `18`
- `<qqh6x` → `24`
- `@llh0l` → `24`

## 64 bits Windows (LLP64)

Aunque el sistema sea de 64 bits, `long` sigue valiendo **4 bytes**, por eso coincide con 32 bits:

- `@lhl` → `12`
- `@llh` → `10`
- `<qqh6x` → `24`
- `@llh0l` → `12`

## ¿Por qué?

- `@` usa tamaño y alineación nativos.
- `<` usa little-endian estándar, sin padding automático.
- `0l` al final fuerza la alineación del final de la estructura al tipo `long`.
