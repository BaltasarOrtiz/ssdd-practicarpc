package ar.edu.ssdd.rmi.estaciones;

import java.rmi.Naming;
import java.rmi.registry.LocateRegistry;

public class SeasonServer {
    public static void main(String[] args) throws Exception {
        LocateRegistry.createRegistry(1099);
        Naming.rebind("rmi://localhost/SeasonService", new SeasonServiceImpl());
        System.out.println("SeasonService publicado en rmi://localhost/SeasonService");
    }
}
