# Sockets — siguiente primo

## Archivos

- `next_prime_server.py`
- `next_prime_client.py`

## Ejecutar

### 1. Servidor

```bash
python next_prime_server.py
```

### 2. Cliente

```bash
python next_prime_client.py
```

## Protocolo usado

- TCP
- mensaje de texto terminado en `\n`
- request: número entero
- response: siguiente primo estricto

## Ejemplo

- Cliente envía: `10`
- Servidor responde: `11`
