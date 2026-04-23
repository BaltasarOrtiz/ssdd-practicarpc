package ar.edu.ssdd.rmi.materias;

import java.rmi.Naming;
import java.util.Scanner;

public class ScheduleClient {
    public static void main(String[] args) throws Exception {
        String host = (args.length > 0) ? args[0] : "localhost";
        ScheduleService service = (ScheduleService) Naming.lookup("rmi://" + host + "/ScheduleService");

        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("Día a consultar: ");
            String dia = scanner.nextLine();

            try {
                System.out.println("Materias: " + service.materiasPorDia(dia));
            } catch (DayNotAvailableException e) {
                System.out.println("Error controlado: " + e.getMessage());
            }
        }
    }
}
