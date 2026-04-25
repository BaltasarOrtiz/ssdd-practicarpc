package ar.edu.ssdd.rmi.calculadora;

import java.rmi.Naming;
import java.util.Scanner;

public class CalculatorClient {
    public static void main(String[] args) throws Exception {
        String host = (args.length > 0) ? args[0] : "localhost";
        CalculatorService service = (CalculatorService) Naming.lookup("rmi://" + host + "/CalculatorService");

        try (Scanner scanner = new Scanner(System.in)) {
            boolean tty = System.console() != null;
            if (tty) System.out.print("Operación (1=suma, 2=resta, 3=divide, 4=multiplica): ");
            int option = scanner.nextInt();

            if (tty) System.out.print("Operando 1: ");
            int op1 = scanner.nextInt();

            if (tty) System.out.print("Operando 2: ");
            int op2 = scanner.nextInt();

            int result = switch (option) {
                case 1 -> service.suma(op1, op2);
                case 2 -> service.resta(op1, op2);
                case 3 -> service.divide(op1, op2);
                case 4 -> service.multiplica(op1, op2);
                default -> throw new IllegalArgumentException("Opción inválida");
            };

            System.out.println("Resultado: " + result);
        }
    }
}
