package ar.edu.ssdd.rmi.paridad;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;

public class ParityServiceImpl extends UnicastRemoteObject implements ParityService {
    public ParityServiceImpl() throws RemoteException {
        super();
    }

    @Override
    public String esParOImpar(int numero) throws RemoteException {
        return (numero % 2 == 0) ? "par" : "impar";
    }
}
