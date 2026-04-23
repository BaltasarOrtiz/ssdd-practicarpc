package ar.edu.ssdd.rmi.estaciones;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface SeasonService extends Remote {
    String estacion(int dia, int mes) throws RemoteException;
}
