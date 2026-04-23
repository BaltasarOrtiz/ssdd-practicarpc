package ar.edu.ssdd.rmi.paridad;

import java.rmi.Naming;
import java.rmi.registry.LocateRegistry;

public class ParityServer {
    public static void main(String[] args) throws Exception {
        LocateRegistry.createRegistry(1099);
        Naming.rebind("rmi://localhost/ParityService", new ParityServiceImpl());
        System.out.println("ParityService publicado en rmi://localhost/ParityService");
    }
}
