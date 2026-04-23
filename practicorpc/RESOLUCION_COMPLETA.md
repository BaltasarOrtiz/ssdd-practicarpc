# Resolución completa — Práctico RPC 2026

## Resumen rápido de la organización

La resolución quedó separada por tema para que no sea una ensalada cósmica:

- `practicorpc/sockets/` → ejercicio 1 con sockets
- `practicorpc/json/` → ejercicios 10 al 14
- `practicorpc/protobuf/` → ejercicio 15
- `practicorpc/rpc/` → Programación RPC clásica (Sun RPC / rpcgen)
- `practicorpc/java-rmi/` → ejercicios de Java RMI
- `practicorpc/grpc/` → ejercicios de gRPC
- `practicorpc/python-rpc-rpyc/` → ejercicio gRPC 3 usando framework Python RPC

## Estado real del entorno actual

Verifiqué el entorno antes de resolver:

- Python disponible: `3.12.10`
- Java disponible: `21.0.10 LTS`
- Node.js disponible: `v24.14.1`
- **No** están instalados en este workspace: `protoc`, `rpcgen`, `rpcinfo`

Entonces, para que el práctico quede bien armado y HONESTO:

- dejé **código fuente completo** donde se podía,
- dejé **IDLs `.proto` y `.x`** donde faltan generadores,
- y agregué **instrucciones exactas de ejecución** para correrlo en una máquina Linux o con dependencias instaladas.

---

## 1) Cliente-servidor con sockets: siguiente primo

Se resolvió en Python con sockets TCP.

Archivos:

- `sockets/next_prime_server.py`
- `sockets/next_prime_client.py`
- `sockets/README.md`

Lógica:

- el cliente envía un número entero,
- el servidor calcula el siguiente primo estricto,
- y devuelve el resultado.

---

## 2) Ejemplo de comunicación transitoria y persistente

- **Transitoria:** una consulta HTTP a una API REST. Si el servidor o la red no están disponibles en ese momento, el mensaje no queda almacenado esperando.
- **Persistente:** una cola de mensajes como RabbitMQ/Kafka con almacenamiento duradero. El mensaje queda retenido hasta que el consumidor lo procese.

---

## 3) Ejemplos de estilo de comunicación

- **a) Requerimiento (R):** envío de log/telemetría por UDP o una notificación “fire-and-forget”.
- **b) Requerimiento–respuesta (RR):** consulta de saldo, búsqueda en una API, calculadora remota.
- **c) Requerimiento–respuesta–confirmación (RRA):** transferencia de archivo o mensaje donde el cliente confirma explícitamente que recibió correctamente la respuesta.

---

## 4) Ejemplos de semántica de invocación

- **a) Mínimo una vez:** reintentar registrar una lectura de sensor o actualizar caché remota. Conviene que la operación sea idempotente.
- **b) Máximo una vez:** débito en una cuenta bancaria o compra online donde no querés duplicar la operación.
- **c) Exactamente una vez:** pago electrónico/liquidación crítica con identificador único, deduplicación y confirmación transaccional extremo a extremo.

> Nota conceptual: en sistemas distribuidos reales, “exactamente una vez” no sale gratis. Se logra combinando protocolo, almacenamiento y deduplicación. No es magia.

---

## 5) Tres ejemplos de operaciones idempotentes

1. Marcar una orden como `cancelada`.
2. Reemplazar la foto de perfil de un usuario por una URL específica.
3. Ejecutar `PUT /usuarios/42` con el mismo payload varias veces.

Si el estado final queda igual aunque repitas la operación, ahí tenés idempotencia. Ese es el concepto, no memorizar la palabrita.

---

## 6) ¿Para qué sirven `htonl`, `htons`, `ntohl`, `ntohs`?

Según la documentación de Linux (`byteorder(3)`), estas funciones convierten enteros entre el orden de bytes de la máquina (**host byte order**) y el orden de bytes de red (**network byte order**, big-endian):

- `htonl` → host to network long (`uint32_t`)
- `htons` → host to network short (`uint16_t`)
- `ntohl` → network to host long (`uint32_t`)
- `ntohs` → network to host short (`uint16_t`)

Sirven para que dos máquinas con arquitecturas distintas interpreten el mismo valor binario de forma consistente.

---

## 7) Resultados de `struct.calcsize(...)`

En **esta máquina actual** (Windows 64 bits, ABI LLP64) verifiqué:

- `calcsize('@lhl') = 12`
- `calcsize('@llh') = 10`
- `calcsize('<qqh6x') = 24`
- `calcsize('@llh0l') = 12`

La verificación se hizo con:

```python
import struct

print(struct.calcsize('@lhl'))
print(struct.calcsize('@llh'))
print(struct.calcsize('<qqh6x'))
print(struct.calcsize('@llh0l'))
```

---

## 8) ¿Qué valores da en 32 y 64 bits y por qué?

Acá hay que entender la ABI, no adivinar.

### a) En 32 bits típico

Normalmente `long = 4 bytes`, `short = 2 bytes`, alineación de `long = 4`.

- `@lhl` → `12`
- `@llh` → `10`
- `<qqh6x` → `24`
- `@llh0l` → `12`

### b) En 64 bits tipo LP64 (Linux/macOS usual)

Normalmente `long = 8 bytes`, `short = 2 bytes`, alineación de `long = 8`.

- `@lhl` → `24`
- `@llh` → `18`
- `<qqh6x` → `24`
- `@llh0l` → `24`

### c) En 64 bits Windows (LLP64)

Aunque el SO es 64 bits, `long` sigue valiendo **4 bytes**, por eso los resultados coinciden con 32 bits:

- `@lhl` → `12`
- `@llh` → `10`
- `<qqh6x` → `24`
- `@llh0l` → `12`

### ¿Por qué pasa esto?

- `@` usa **tamaño y alineación nativos**.
- `<` usa **little-endian estándar, sin padding automático**.
- `0l` al final fuerza alineación del final de la estructura al tipo `long`.

Esto está respaldado por la documentación oficial de `struct` de Python: con `@` hay padding entre campos; con `<`, `>`, `=`, `!` no lo hay; y `0l` se usa para alinear el final.

---

## 9) `rpcinfo -p host` y análisis con NFS

### Lo que pude verificar en este entorno

No pude ejecutar `rpcinfo -p host` en este workspace porque `rpcinfo` **no está instalado** en Windows.

### Qué se debe hacer en Linux

```bash
rpcinfo -p localhost
```

### Análisis esperado

Antes de levantar NFS, normalmente aparece al menos:

- `rpcbind` / `portmapper` en puerto `111` TCP/UDP

Después de levantar servidor/cliente NFS suelen registrarse además servicios RPC como:

- `nfs`
- `mountd`
- `nlockmgr` / `nlm`
- `status` / `statd`
- a veces `rquotad`

### Interpretación

- `rpcbind` mantiene el mapa **programa RPC → puerto**.
- NFS y servicios asociados se registran ahí porque varios usan puertos dinámicos.
- Al volver a correr `rpcinfo -p`, deberían verse **más programas, más versiones, protocolos y puertos**.

En `practicorpc/rpc/README.md` dejé una guía concreta de preparación para Linux.

---

# JSON

## 10) Diez alumnos con número de registro

Archivo:

- `json/alumnos.json`

Usé datos **ficticios** para no inventar datos reales del curso.

## 11) JSON de inventario informático

Archivo:

- `json/inventario_informatica.json`

Cada ítem tiene más de 5 campos.

## 12) JSON del Censo 2022 con 5 registros y 10 campos

Archivo:

- `json/censo_2022_5_registros.json`

Tomé 5 jurisdicciones y armé 10 campos por registro combinando:

- Cuadro 1 (viviendas, población total, calle, colectivas, etc.)
- Cuadro 2 (sexo en viviendas particulares)

## 13) Probarlos en JSONLint

Dejé dos cosas:

- `json/validar_json.js` → validación local con `JSON.parse`
- `json/README.md` → instrucciones para probar los archivos en JSONLint

## 14) Probar `JSON.parse()` y `JSON.stringify()` con 2 ejemplos

Archivo:

- `json/parse_stringify_examples.js`

Ejemplos usados:

- alumnos
- inventario

## 15) Primeros 2 ejercicios en Protobuf

Archivos:

- `protobuf/alumnos.proto`
- `protobuf/inventario_informatica.proto`
- `protobuf/README.md`

Como `protoc` no está instalado acá, dejé la definición completa y los comandos para generar código cuando lo instales.

---

# Programación RPC

## a) Cliente/servidor RPC: par o impar

Archivos:

- `rpc/paridad_rpc.x`
- `rpc/paridad_client.c`
- `rpc/paridad_server_impl.c`

## b) Cliente/servidor RPC: calculadora

Archivos:

- `rpc/calculadora_rpc.x`
- `rpc/calculadora_client.c`
- `rpc/calculadora_server_impl.c`

En la calculadora usé una `struct operandos` porque en Sun RPC el procedimiento remoto recibe **un solo parámetro**. Entonces, si querés mandar dos operandos, los encapsulás. Ese detalle sale DIRECTO de la teoría.

## Nota importante

No pude generar los stubs porque en este entorno faltan `rpcgen` y `rpcinfo`, pero la resolución quedó preparada para correr en Linux con `rpcgen`.

---

# Práctico Java RMI

## a) Instalar Java RMI

No se instala aparte: **Java RMI ya viene incluido en el JDK**. Acá verifiqué Java 21, así que el requisito está cubierto por el propio JDK.

## b) Ejercicios RPC a) y b) en Java RMI

Resueltos en:

- `java-rmi/paridad/`
- `java-rmi/calculadora/`

## c) Extender a 2 computadoras

La misma implementación sirve. En `java-rmi/README.md` dejé:

- uso de `LocateRegistry.createRegistry(1099)`
- configuración de host
- nota sobre `-Djava.rmi.server.hostname=`
- apertura de firewall/puertos

## d) Cliente envía fecha y servidor responde estación

Resuelto en:

- `java-rmi/estaciones/`

Devuelve:

- `Verano`
- `Otoño`
- `Invierno`
- `Primavera`

## e) Diccionario de materias por día

Resuelto en:

- `java-rmi/materias/`

Incluye excepción personalizada para sábado y domingo:

- `DayNotAvailableException`

## f) Agregar demora y analizar caída de servidor/cliente

La demora artificial quedó dentro de la implementación de calculadora.

Análisis esperado en RMI:

- si el **servidor** no está disponible, el cliente suele recibir una `RemoteException`, y muchas veces una `ConnectException` anidada;
- si el servidor cae durante la llamada, puede aparecer `RemoteException`, `ConnectIOException` o `UnmarshalException`, según el momento del fallo;
- si cae el **cliente**, el servidor normalmente no “mantiene sesión” como tal en una invocación simple: termina el método y no necesariamente obtiene una señal semántica útil inmediata, salvo que haya callbacks o más interacción.

---

# gRPC

## 1) Comparar gRPC con REST

### gRPC

- contrato formal con `.proto`
- binario (Protobuf), más compacto
- muy bueno para baja latencia y comunicación servicio a servicio
- soporta unary y streaming
- genera stubs automáticamente

### REST

- usa HTTP con recursos y verbos (`GET`, `POST`, etc.)
- normalmente JSON, más legible para humanos
- más simple de inspeccionar con navegador/Postman/curl
- ideal para APIs públicas y frontends web

### Resumen corto

- **REST** gana en simplicidad, compatibilidad universal y debugging manual.
- **gRPC** gana en contrato fuerte, performance y tipado.

## 2) Ejercicios b) y d) de Java RMI en gRPC, cliente y server en lenguajes distintos

Resueltos en:

- `grpc/protos/calculator.proto`
- `grpc/protos/season.proto`
- `grpc/python-server/`
- `grpc/node-client/`

Elegí:

- **server en Python**
- **client en Node.js**

## 3) Framework Python RPC para ejercicios a) y b)

Elegí **RPyC**.

Resuelto en:

- `python-rpc-rpyc/paridad/`
- `python-rpc-rpyc/calculadora/`

### Comparación rápida de experiencia

- **Sockets:** máximo control, más trabajo manual.
- **Sun RPC:** contrato clásico, muy académico, más rígido.
- **Java RMI:** excelente si todo es Java, flojo para interoperabilidad.
- **gRPC:** muy sólido para microservicios y multilenguaje.
- **RPyC:** rapidísimo para Python↔Python, pero menos portable y con contrato menos explícito que gRPC.

---

## Fuentes usadas

- `invocacion-remota00.pdf`
- `invocacion-remota01.pdf`
- `practicorpc/cnphv2022_resultados_provisionales.pdf`
- Documentación oficial de Python `struct`
- Manual Linux `byteorder(3)`
- Documentación oficial Java RMI
- Documentación oficial gRPC
