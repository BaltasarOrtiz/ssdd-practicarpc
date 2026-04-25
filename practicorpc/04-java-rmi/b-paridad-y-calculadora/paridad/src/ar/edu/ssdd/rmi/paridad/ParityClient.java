package ar.edu.ssdd.rmi.paridad;

import java.rmi.Naming;
import java.util.Scanner;

public class ParityClient {
    public static void main(String[] args) throws Exception {
        String host = (args.length > 0) ? args[0] : "localhost";
        ParityService service = (ParityService) Naming.lookup("rmi://" + host + "/ParityService");

        try (Scanner scanner = new Scanner(System.in)) {
            boolean tty = System.console() != null;
            if (tty) System.out.print("Ingresá un número: ");
            int numero = scanner.nextInt();
            System.out.println("Resultado: " + service.esParOImpar(numero));
        }
    }
}
