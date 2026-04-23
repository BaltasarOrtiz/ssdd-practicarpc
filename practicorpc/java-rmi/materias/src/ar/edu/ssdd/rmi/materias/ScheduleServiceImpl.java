package ar.edu.ssdd.rmi.materias;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class ScheduleServiceImpl extends UnicastRemoteObject implements ScheduleService {
    private final Map<String, List<String>> materias = Map.of(
        "lunes", List.of("Sistemas Distribuidos", "Ingeniería de Software"),
        "martes", List.of("Bases de Datos"),
        "miércoles", List.of("Sistemas Distribuidos", "Ingeniería de Software"),
        "jueves", List.of("Bases de Datos"),
        "viernes", List.of("Redes")
    );

    public ScheduleServiceImpl() throws RemoteException {
        super();
    }

    @Override
    public List<String> materiasPorDia(String dia) throws RemoteException, DayNotAvailableException {
        String normalized = dia.toLowerCase(Locale.ROOT);

        if (!materias.containsKey(normalized)) {
            throw new DayNotAvailableException("No hay materias cargadas para '" + dia + "'. Probá lunes a viernes.");
        }

        return materias.get(normalized);
    }
}
