# Python RPC con RPyC

Elegí **RPyC** para resolver los ejercicios de paridad y calculadora en Python↔Python.

## Dependencia

```bash
pip install rpyc
```

## Ejecución

### Paridad

```bash
python a-paridad/parity_service.py
python a-paridad/parity_client.py
```

### Calculadora

```bash
python b-calculadora/calculator_service.py
python b-calculadora/calculator_client.py
```

## Comparación breve

- más simple que sockets y Sun RPC para Python puro
- menos interoperable que gRPC
- contrato menos formal que `.proto`
- excelente para laboratorio rápido en Python↔Python
