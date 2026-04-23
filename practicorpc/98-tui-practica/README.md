# TUI de la parte práctica

Esta carpeta agrega una **TUI en Node.js** para Ubuntu/Debian que permite:

- verificar dependencias del sistema y del proyecto,
- instalar / preparar el entorno del práctico,
- ejecutar los incisos prácticos que tienen código ejecutable,
- y dejar asistidos los casos especiales como **NFS** o **Java RMI en dos computadoras**.

## Stack elegido

- [`ink`](https://github.com/vadimdemedes/ink)
- [`@inkjs/ui`](https://github.com/vadimdemedes/ink-ui)

La implementación corre **sin build**, directo con Node.js.

## Requisito mínimo

Para correr la TUI ya tenés que tener:

- `node`
- `npm`

La propia TUI después te ayuda con el resto del entorno del práctico.

## Instalación

```bash
cd practicorpc/98-tui-practica
npm install
```

## Uso

```bash
npm start
```

## Alcance real

### Ejecuta directamente

- sockets del siguiente primo,
- `calcsize`,
- `rpcinfo`,
- validación JSON,
- `JSON.parse` / `JSON.stringify`,
- Protobuf,
- Sun RPC clásica,
- Java RMI local,
- gRPC Python ↔ Node,
- RPyC.

### Asiste, pero depende del entorno

- **inciso 9 con NFS**: la TUI puede instalar los paquetes, pero la configuración real de exports/servicios sigue dependiendo del host.
- **Java RMI en dos computadoras**: la TUI puede correr el cliente remoto y levantar el server preparado para otra máquina, pero la conectividad/firewall siguen siendo responsabilidad del entorno.

## Nota importante

Las acciones de instalación del sistema usan `sudo`, así que en Ubuntu/Debian te van a pedir credenciales cuando corresponda.
