#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include "paridad_rpc.h"

int main(int argc, char *argv[]) {
    CLIENT *clnt;
    int numero;
    char **resultado;

    if (argc != 2) {
        fprintf(stderr, "Uso: %s <host>\n", argv[0]);
        exit(1);
    }

    clnt = clnt_create(argv[1], PARIDAD_PROG, PARIDAD_V1, "udp");
    if (clnt == NULL) {
        clnt_pcreateerror(argv[1]);
        exit(1);
    }

    if (isatty(STDIN_FILENO)) printf("Ingresá un número: ");
    scanf("%d", &numero);

    resultado = es_par_impar_1(&numero, clnt);
    if (resultado == NULL) {
        clnt_perror(clnt, "Error en llamada RPC");
        exit(1);
    }

    printf("El número %d es %s\n", numero, *resultado);
    clnt_destroy(clnt);
    return 0;
}
