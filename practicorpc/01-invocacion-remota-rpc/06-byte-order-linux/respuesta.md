# 6) Funciones `htonl`, `htons`, `ntohl`, `ntohs`

Según la documentación de Linux (`byteorder(3)`), estas funciones convierten enteros entre el orden de bytes de la máquina (**host byte order**) y el orden de bytes de red (**network byte order**, big-endian):

- `htonl` → host to network long (`uint32_t`)
- `htons` → host to network short (`uint16_t`)
- `ntohl` → network to host long (`uint32_t`)
- `ntohs` → network to host short (`uint16_t`)

Sirven para que dos máquinas con arquitecturas distintas interpreten los mismos valores binarios de forma consistente cuando intercambian datos por red.
