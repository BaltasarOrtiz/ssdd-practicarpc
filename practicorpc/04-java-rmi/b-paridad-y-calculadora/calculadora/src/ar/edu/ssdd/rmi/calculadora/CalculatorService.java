package ar.edu.ssdd.rmi.calculadora;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface CalculatorService extends Remote {
    int suma(int op1, int op2) throws RemoteException;
    int resta(int op1, int op2) throws RemoteException;
    int divide(int op1, int op2) throws RemoteException;
    int multiplica(int op1, int op2) throws RemoteException;
}
