package ar.edu.ssdd.rmi.calculadora;

import java.rmi.Naming;
import java.rmi.registry.LocateRegistry;

public class CalculatorServer {
    public static void main(String[] args) throws Exception {
        String hostname = System.getProperty("java.rmi.server.hostname", "localhost");
        LocateRegistry.createRegistry(1099);
        Naming.rebind("rmi://localhost/CalculatorService", new CalculatorServiceImpl());
        System.out.println("[SERVER] CalculatorService escuchando en rmi://" + hostname + ":1099/CalculatorService");
        System.out.println("[SERVER] Esperando conexiones remotas... (Ctrl+C para detener)");
    }
}
