# 9) `rpcinfo -p host` y análisis con NFS

## Situación del entorno actual

En este workspace Windows no estaba disponible `rpcinfo`, así que este inciso quedó documentado para ejecutarse en Linux.

## Comando a ejecutar

```bash
rpcinfo -p localhost
```

## Qué debería verse antes de NFS

Normalmente al menos:

- `rpcbind` / `portmapper` en puerto `111` TCP/UDP

## Qué suele aparecer al levantar NFS

- `nfs`
- `mountd`
- `nlockmgr` / `nlm`
- `status` / `statd`
- a veces `rquotad`

## Interpretación

- `rpcbind` mantiene el mapa **programa RPC → puerto**.
- NFS y servicios asociados se registran ahí porque varios usan puertos dinámicos.
- Al volver a correr `rpcinfo -p`, deberían verse más programas, versiones, protocolos y puertos.
