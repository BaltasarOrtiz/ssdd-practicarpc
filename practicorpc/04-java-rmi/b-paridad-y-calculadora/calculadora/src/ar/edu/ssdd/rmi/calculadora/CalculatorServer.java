package ar.edu.ssdd.rmi.calculadora;

import java.rmi.Naming;
import java.rmi.registry.LocateRegistry;

public class CalculatorServer {
    public static void main(String[] args) throws Exception {
        LocateRegistry.createRegistry(1099);
        Naming.rebind("rmi://localhost/CalculatorService", new CalculatorServiceImpl());
        System.out.println("CalculatorService publicado en rmi://localhost/CalculatorService");
    }
}
