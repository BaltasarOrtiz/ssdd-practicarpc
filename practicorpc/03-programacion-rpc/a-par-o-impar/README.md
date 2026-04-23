# Programación RPC — inciso a) par o impar

## Archivos

- `paridad_rpc.x`
- `paridad_client.c`
- `paridad_server_impl.c`

## Flujo

1. Generar stubs con `rpcgen`.
2. Compilar cliente y servidor.
3. Registrar el servicio con `rpcbind`.

## Comandos típicos en Linux

```bash
rpcgen paridad_rpc.x
gcc -o paridad_server paridad_rpc_svc.c paridad_rpc_xdr.c paridad_server_impl.c -ltirpc -I/usr/include/tirpc
gcc -o paridad_client paridad_rpc_clnt.c paridad_rpc_xdr.c paridad_client.c -ltirpc -I/usr/include/tirpc
```

> En este entorno Windows no estaban instalados `rpcgen` ni `rpcinfo`, por eso la ejecución real queda documentada para Linux.
