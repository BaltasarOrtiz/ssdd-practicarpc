# Sistemas Distribuidos

## Práctico Invocación Remota - RPC

### 1)
Desarrollar una aplicación con un cliente que solicita a un servidor que, dado un número, calcule el siguiente primo. La comunicación entre cliente y servidor se debe realizar con sockets.

### 2)
Dé 1 ejemplo de comunicación transitoria y otro persistente en SSDD.

### 3)
Nombre un ejemplo de aplicación con estilo de comunicación:

- a) requerimiento
- b) requerimiento–respuesta
- c) requerimiento, respuesta, confirmación

### 4)
Dé un ejemplo de aplicación donde se pueda aplicar la semántica de:

- a) mínimo una vez
- b) máximo una vez
- c) exactamente una vez

### 5)
Nombre tres ejemplos de donde aplicaría operaciones idempotentes.

### 6)
Describir para qué sirven las funciones `htonl`, `htons`, `ntohl`, `ntohs` disponibles en Linux.

### 7)
Ejecutar los comandos en Python:

- `calcsize('@lhl')`
- `calcsize('@llh')`
- `calcsize('<qqh6x')`
- `calcsize('@llh0l')`

### 8)
En diferentes arquitecturas (32 y 64 bits), ¿qué valores arroja y por qué?

### 9)
Ejecutar el comando `rpcinfo -p host` y analizar qué procesos se están ejecutando. A continuación, abrir NFS Server y Cliente y volver a ejecutar.

## JSON

### 10)
Completar el ejemplo de las diapositivas con diez alumnos del curso, agregando número de registro.

### 11)
Realizar un archivo JSON con datos de inventarios de artículos de informática (con al menos 5 campos) a su elección. Ej.: impresora, tipo, marca, etc. O algún software.

### 12)
Con los datos del censo 2022, elegir 10 campos y crear un JSON con 5 registros.

Fuente:

<https://www.indec.gob.ar/ftp/cuadros/poblacion/cnphv2022_resultados_provisionales.pdf>

*(Páginas 71 a 78)*

### 13)
Probarlos en JSONLint.

### 14)
Probar las funciones `JSON.parse()` y `JSON.stringify()` con 2 ejemplos de los ejercicios anteriores.

### 15)
Realizar los primeros 2 ejercicios en Protobuf.

## Programación RPC

### a)
Desarrollar una aplicación cliente-servidor con RPC que, cuando el cliente envíe un número, el servidor responda si es par o impar.

### b)
Desarrolle una aplicación cliente/servidor utilizando RPC en la que se utilice un procedimiento remoto **Calculadora** (en la misma computadora) que provea los siguientes resultados:

- `int suma (int op1, int op2)`: devuelve `op1 + op2`
- `int resta (int op1, int op2)`: devuelve `op1 - op2`
- `int divide (int op1, int op2)`: devuelve `op1 / op2`
- `int multiplica (int op1, int op2)`: devuelve `op1 * op2`

## Práctico Java RMI

### a)
Instalar Java RMI en su computadora.

### b)
Realizar los ejercicios a) y b) de RPC en Java RMI.

### c)
Extender el ejercicio anterior en 2 computadoras distintas (no sé si los firewalls nos van a permitir hacerlo, pero podemos probar).

### d)
Hacer los programas cliente y servidor correspondientes que hagan lo siguiente: el cliente ingresa una fecha y responde el servidor: **Hola Verano**, **Invierno**, **Otoño**, **Primavera**, según corresponda.

### e)
Implementar un servidor que permita mostrar, como si fuera un diccionario en Python, las materias que tienen un día de la semana determinado (en este caso se han usado código de materias, podrían poner nombres).

```python
materias["lunes"] = [6103, 7540]
materias["martes"] = [5068]
materias["miércoles"] = [6103, 7540]
materias["jueves"] = [5068]
materias["viernes"] = [6201]
```

Si consulta el cliente `print materias["lunes"]`, debería responder `6103` y `7540`.

*(Las pueden cambiar por nombres).*

Agregar una excepción por si pregunta por día sábado o domingo. En Python se utiliza la función `has_key` o la palabra reservada `in`.

### f)
Al ejercicio 2 agregarle una demora en el servidor. Bajar el servidor y ver qué pasa con el cliente. Bajar el cliente y ver qué pasa (si el sistema de Java RMI soporta o indica el error de alguna manera).

## gRPC

### 1)
Comparar gRPC con REST.

### 2)
Realizar los ejercicios b) y d) de Java RMI en gRPC, pero en este caso el cliente en un lenguaje y el server en otro.

### 3)
Seleccionar por grupo un framework o programación nativa de Python para RPC y realizar el ejercicio a) y b) de RPC. Comparar las experiencias de los distintos grupos.

Los frameworks pueden ser:

- PyRo
- ZeroRPC
- RPyC

Más alternativas en:

<https://stackoverflow.com/questions/1879971/what-is-the-current-choice-for-doing-rpc-in-python>
