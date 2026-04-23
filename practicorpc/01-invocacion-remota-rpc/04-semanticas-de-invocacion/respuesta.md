# 4) Ejemplos de semántica de invocación

- **a) Mínimo una vez:** registrar una lectura de sensor o actualizar una caché remota, idealmente con operación idempotente.
- **b) Máximo una vez:** débito bancario o compra online para evitar duplicaciones.
- **c) Exactamente una vez:** pago electrónico crítico con identificador único, deduplicación y confirmación transaccional.

> En sistemas distribuidos reales, “exactamente una vez” no sale gratis: hay que combinar protocolo, almacenamiento y deduplicación.
