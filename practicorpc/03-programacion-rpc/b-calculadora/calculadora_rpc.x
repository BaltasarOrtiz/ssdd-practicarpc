struct operandos {
    int op1;
    int op2;
};

program CALCULADORA_PROG {
    version CALCULADORA_V1 {
        int suma(operandos) = 1;
        int resta(operandos) = 2;
        int divide(operandos) = 3;
        int multiplica(operandos) = 4;
    } = 1;
} = 0x20000002;
