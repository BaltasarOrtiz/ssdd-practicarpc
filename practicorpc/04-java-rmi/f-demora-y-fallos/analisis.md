# Java RMI — inciso f) demora y fallos

La demora artificial quedó implementada en la calculadora RMI.

## Qué pasa si el servidor no está disponible

El cliente suele recibir una `RemoteException`, y muchas veces una `ConnectException` o `ConnectIOException` anidada.

## Qué pasa si el servidor cae durante la llamada

Puede aparecer:

- `RemoteException`
- `ConnectIOException`
- `UnmarshalException`

depende del momento exacto del fallo.

## Qué pasa si el cliente cae

En una invocación simple, el servidor no mantiene sesión fuerte como tal. Puede terminar el método sin obtener una señal semántica útil inmediata, salvo que haya callbacks o más interacción.
