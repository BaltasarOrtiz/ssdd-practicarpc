#include "paridad_rpc.h"

char **es_par_impar_1_svc(int *numero, struct svc_req *rqstp) {
    static char *resultado;

    if ((*numero % 2) == 0) {
        resultado = "par";
    } else {
        resultado = "impar";
    }

    return &resultado;
}
