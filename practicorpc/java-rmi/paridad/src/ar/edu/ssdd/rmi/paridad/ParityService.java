package ar.edu.ssdd.rmi.paridad;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface ParityService extends Remote {
    String esParOImpar(int numero) throws RemoteException;
}
