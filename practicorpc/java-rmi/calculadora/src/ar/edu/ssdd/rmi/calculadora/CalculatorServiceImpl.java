package ar.edu.ssdd.rmi.calculadora;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;

public class CalculatorServiceImpl extends UnicastRemoteObject implements CalculatorService {
    private static final long ARTIFICIAL_DELAY_MS = 3000;

    public CalculatorServiceImpl() throws RemoteException {
        super();
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
        simulateDelay();
        return op1 + op2;
    }

    @Override
    public int resta(int op1, int op2) throws RemoteException {
        simulateDelay();
        return op1 - op2;
    }

    @Override
    public int divide(int op1, int op2) throws RemoteException {
        simulateDelay();
        if (op2 == 0) {
            throw new RemoteException("No se puede dividir por cero");
        }
        return op1 / op2;
    }

    @Override
    public int multiplica(int op1, int op2) throws RemoteException {
        simulateDelay();
        return op1 * op2;
    }
}
