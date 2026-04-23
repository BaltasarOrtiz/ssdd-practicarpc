package ar.edu.ssdd.rmi.materias;

import java.rmi.Naming;
import java.rmi.registry.LocateRegistry;

public class ScheduleServer {
    public static void main(String[] args) throws Exception {
        LocateRegistry.createRegistry(1099);
        Naming.rebind("rmi://localhost/ScheduleService", new ScheduleServiceImpl());
        System.out.println("ScheduleService publicado en rmi://localhost/ScheduleService");
    }
}
