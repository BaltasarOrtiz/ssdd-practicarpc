# Java RMI

## Aclaración clave

Java RMI ya viene dentro del JDK. No hay que “instalar Java RMI” por separado.

## Estructura

- `paridad/`
- `calculadora/`
- `estaciones/`
- `materias/`

## Compilación manual (ejemplo)

Desde cada carpeta de ejercicio:

```bash
javac -d out src/ar/edu/ssdd/rmi/.../*.java
```

## Ejecución típica

### Servidor

```bash
java -cp out ar.edu.ssdd.rmi.paridad.ParityServer
```

### Cliente

```bash
java -cp out ar.edu.ssdd.rmi.paridad.ParityClient localhost
```

## En dos computadoras distintas

Si querés exponer el objeto remoto por red:

```bash
java -Djava.rmi.server.hostname=IP_DEL_SERVIDOR -cp out ar.edu.ssdd.rmi.calculadora.CalculatorServer
```

Y desde el cliente:

```bash
java -cp out ar.edu.ssdd.rmi.calculadora.CalculatorClient IP_DEL_SERVIDOR
```

## Qué pasa si hay fallas

- servidor caído → el cliente suele recibir `RemoteException` con `ConnectException` o `ConnectIOException`
- objeto remoto no disponible → puede aparecer `NotBoundException` o `NoSuchObjectException`
- error al serializar/deserializar → `MarshalException` / `UnmarshalException`

Eso está alineado con la documentación oficial del paquete `java.rmi`.
