package ar.edu.ssdd.rmi.estaciones;

import java.rmi.Naming;
import java.util.Scanner;

public class SeasonClient {
    public static void main(String[] args) throws Exception {
        String host = (args.length > 0) ? args[0] : "localhost";
        SeasonService service = (SeasonService) Naming.lookup("rmi://" + host + "/SeasonService");

        try (Scanner scanner = new Scanner(System.in)) {
            boolean tty = System.console() != null;
            if (tty) System.out.print("Día: ");
            int dia = scanner.nextInt();
            if (tty) System.out.print("Mes: ");
            int mes = scanner.nextInt();

            System.out.println("Respuesta del servidor: " + service.estacion(dia, mes));
        }
    }
}
