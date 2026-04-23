package ar.edu.ssdd.rmi.estaciones;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;

public class SeasonServiceImpl extends UnicastRemoteObject implements SeasonService {
    public SeasonServiceImpl() throws RemoteException {
        super();
    }

    @Override
    public String estacion(int dia, int mes) throws RemoteException {
        int value = mes * 100 + dia;

        if (value >= 1221 || value <= 320) {
            return "Verano";
        }
        if (value >= 321 && value <= 620) {
            return "Otoño";
        }
        if (value >= 621 && value <= 920) {
            return "Invierno";
        }
        return "Primavera";
    }
}
