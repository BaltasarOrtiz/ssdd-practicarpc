# Programación RPC — inciso b) calculadora

## Archivos

- `calculadora_rpc.x`
- `calculadora_client.c`
- `calculadora_server_impl.c`

## Detalle importante

Se usa una `struct operandos` porque en Sun RPC el procedimiento remoto recibe **un solo parámetro**. Entonces, si necesitás enviar dos operandos, los encapsulás en una estructura.

## Comandos típicos en Linux

```bash
rpcgen calculadora_rpc.x
gcc -o calculadora_server calculadora_rpc_svc.c calculadora_rpc_xdr.c calculadora_server_impl.c -ltirpc -I/usr/include/tirpc
gcc -o calculadora_client calculadora_rpc_clnt.c calculadora_rpc_xdr.c calculadora_client.c -ltirpc -I/usr/include/tirpc
```
