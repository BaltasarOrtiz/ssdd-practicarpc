package ar.edu.ssdd.rmi.calculadora;

import java.rmi.RemoteException;
import java.rmi.server.RemoteServer;
import java.rmi.server.UnicastRemoteObject;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class CalculatorServiceImpl extends UnicastRemoteObject implements CalculatorService {
    private static final long ARTIFICIAL_DELAY_MS = 3000;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("HH:mm:ss");

    public CalculatorServiceImpl() throws RemoteException {
        super();
    }

    private String timestamp() {
        return LocalTime.now().format(FMT);
    }

    private String clientHost() {
        try {
            return RemoteServer.getClientHost();
        } catch (Exception e) {
            return "desconocido";
        }
    }

    private void simulateDelay() throws RemoteException {
        try {
            Thread.sleep(ARTIFICIAL_DELAY_MS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RemoteException("La ejecución fue interrumpida", e);
        }
    }

    @Override
    public int suma(int op1, int op2) throws RemoteException {
        String client = clientHost();
        System.out.printf("[%s] ← ENTRADA  suma(%d, %d)  desde %s%n", timestamp(), op1, op2, client);
        simulateDelay();
        int result = op1 + op2;
        System.out.printf("[%s] → SALIDA   suma(%d, %d) = %d  hacia %s%n", timestamp(), op1, op2, result, client);
        return result;
    }

    @Override
    public int resta(int op1, int op2) throws RemoteException {
        String client = clientHost();
        System.out.printf("[%s] ← ENTRADA  resta(%d, %d)  desde %s%n", timestamp(), op1, op2, client);
        simulateDelay();
        int result = op1 - op2;
        System.out.printf("[%s] → SALIDA   resta(%d, %d) = %d  hacia %s%n", timestamp(), op1, op2, result, client);
        return result;
    }

    @Override
    public int divide(int op1, int op2) throws RemoteException {
        String client = clientHost();
        System.out.printf("[%s] ← ENTRADA  divide(%d, %d)  desde %s%n", timestamp(), op1, op2, client);
        simulateDelay();
        if (op2 == 0) {
            System.out.printf("[%s] ✖ ERROR    divide por cero — rechazado hacia %s%n", timestamp(), client);
            throw new RemoteException("No se puede dividir por cero");
        }
        int result = op1 / op2;
        System.out.printf("[%s] → SALIDA   divide(%d, %d) = %d  hacia %s%n", timestamp(), op1, op2, result, client);
        return result;
    }

    @Override
    public int multiplica(int op1, int op2) throws RemoteException {
        String client = clientHost();
        System.out.printf("[%s] ← ENTRADA  multiplica(%d, %d)  desde %s%n", timestamp(), op1, op2, client);
        simulateDelay();
        int result = op1 * op2;
        System.out.printf("[%s] → SALIDA   multiplica(%d, %d) = %d  hacia %s%n", timestamp(), op1, op2, result, client);
        return result;
    }
}
