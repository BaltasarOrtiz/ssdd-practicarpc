# 7) Resultados de `struct.calcsize(...)`

En esta máquina actual (**Windows 64 bits, ABI LLP64**) se verificó:

- `calcsize('@lhl') = 12`
- `calcsize('@llh') = 10`
- `calcsize('<qqh6x') = 24`
- `calcsize('@llh0l') = 12`

## Script

```bash
python calcsize_check.py
```
