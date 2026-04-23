# Java RMI — inciso c) dos computadoras

La misma implementación del inciso **b)** sirve para ejecutarse en dos máquinas distintas.

## Servidor

```bash
java -Djava.rmi.server.hostname=IP_DEL_SERVIDOR -cp out ar.edu.ssdd.rmi.calculadora.CalculatorServer
```

## Cliente

```bash
java -cp out ar.edu.ssdd.rmi.calculadora.CalculatorClient IP_DEL_SERVIDOR
```

## Consideraciones

- asegurar conectividad entre ambas máquinas
- verificar puertos y firewall
- publicar el hostname/IP correcto del servidor RMI
