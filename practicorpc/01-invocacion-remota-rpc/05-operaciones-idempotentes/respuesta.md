# 5) Tres ejemplos de operaciones idempotentes

1. Marcar una orden como `cancelada`.
2. Reemplazar la foto de perfil de un usuario por una URL específica.
3. Ejecutar `PUT /usuarios/42` con el mismo payload varias veces.

Si repetir la operación deja el mismo estado final, entonces es idempotente.
