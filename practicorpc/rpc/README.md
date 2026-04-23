# RPC clásica (Sun RPC / rpcgen)

## Archivos incluidos

- `paridad_rpc.x`
- `paridad_client.c`
- `paridad_server_impl.c`
- `calculadora_rpc.x`
- `calculadora_client.c`
- `calculadora_server_impl.c`

## Idea de trabajo

1. Generar stubs con `rpcgen`
2. Compilar cliente y servidor
3. Registrar el servicio vía `rpcbind`
4. Consultar con `rpcinfo -p localhost`

## Comandos típicos en Linux

### Paridad

```bash
rpcgen paridad_rpc.x
gcc -o paridad_server paridad_rpc_svc.c paridad_rpc_xdr.c paridad_server_impl.c -ltirpc -I/usr/include/tirpc
gcc -o paridad_client paridad_rpc_clnt.c paridad_rpc_xdr.c paridad_client.c -ltirpc -I/usr/include/tirpc
```

### Calculadora

```bash
rpcgen calculadora_rpc.x
gcc -o calculadora_server calculadora_rpc_svc.c calculadora_rpc_xdr.c calculadora_server_impl.c -ltirpc -I/usr/include/tirpc
gcc -o calculadora_client calculadora_rpc_clnt.c calculadora_rpc_xdr.c calculadora_client.c -ltirpc -I/usr/include/tirpc
```

## Ver procesos RPC activos

```bash
rpcinfo -p localhost
```

Si levantás NFS, además de `rpcbind` deberían aparecer servicios como `nfs`, `mountd`, `nlockmgr` y `statd`, dependiendo de la distro.

## Nota

En este entorno Windows actual no están instalados `rpcgen` ni `rpcinfo`, por eso dejé la solución lista para correr en Linux.
