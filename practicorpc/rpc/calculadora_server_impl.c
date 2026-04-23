#include <stdio.h>
#include "calculadora_rpc.h"

int *suma_1_svc(operandos *args, struct svc_req *rqstp) {
    static int resultado;
    resultado = args->op1 + args->op2;
    return &resultado;
}

int *resta_1_svc(operandos *args, struct svc_req *rqstp) {
    static int resultado;
    resultado = args->op1 - args->op2;
    return &resultado;
}

int *divide_1_svc(operandos *args, struct svc_req *rqstp) {
    static int resultado;

    if (args->op2 == 0) {
        fprintf(stderr, "No se puede dividir por cero. Se devuelve 0.\n");
        resultado = 0;
        return &resultado;
    }

    resultado = args->op1 / args->op2;
    return &resultado;
}

int *multiplica_1_svc(operandos *args, struct svc_req *rqstp) {
    static int resultado;
    resultado = args->op1 * args->op2;
    return &resultado;
}
