#include <stdio.h>
#include <stdlib.h>
#include "calculadora_rpc.h"

static int invocar_operacion(CLIENT *clnt, int opcion, operandos args) {
    int *resultado = NULL;

    switch (opcion) {
        case 1:
            resultado = suma_1(&args, clnt);
            break;
        case 2:
            resultado = resta_1(&args, clnt);
            break;
        case 3:
            resultado = divide_1(&args, clnt);
            break;
        case 4:
            resultado = multiplica_1(&args, clnt);
            break;
        default:
            fprintf(stderr, "Opción inválida\n");
            exit(1);
    }

    if (resultado == NULL) {
        clnt_perror(clnt, "Error en llamada RPC");
        exit(1);
    }

    return *resultado;
}

int main(int argc, char *argv[]) {
    CLIENT *clnt;
    operandos args;
    int opcion;

    if (argc != 2) {
        fprintf(stderr, "Uso: %s <host>\n", argv[0]);
        exit(1);
    }

    clnt = clnt_create(argv[1], CALCULADORA_PROG, CALCULADORA_V1, "udp");
    if (clnt == NULL) {
        clnt_pcreateerror(argv[1]);
        exit(1);
    }

    printf("Operación (1=suma, 2=resta, 3=divide, 4=multiplica): ");
    scanf("%d", &opcion);

    printf("Operando 1: ");
    scanf("%d", &args.op1);
    printf("Operando 2: ");
    scanf("%d", &args.op2);

    printf("Resultado: %d\n", invocar_operacion(clnt, opcion, args));

    clnt_destroy(clnt);
    return 0;
}
