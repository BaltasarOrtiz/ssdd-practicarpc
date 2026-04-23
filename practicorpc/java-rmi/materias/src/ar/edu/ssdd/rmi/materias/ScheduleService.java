package ar.edu.ssdd.rmi.materias;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

public interface ScheduleService extends Remote {
    List<String> materiasPorDia(String dia) throws RemoteException, DayNotAvailableException;
}
