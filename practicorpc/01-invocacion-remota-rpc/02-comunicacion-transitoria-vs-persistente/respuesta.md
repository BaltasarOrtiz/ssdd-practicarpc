# 2) Comunicación transitoria y persistente

- **Comunicación transitoria:** una consulta HTTP a una API REST. Si el servidor o la red no están disponibles en ese momento, el mensaje no queda almacenado esperando.
- **Comunicación persistente:** una cola de mensajes como RabbitMQ o Kafka con persistencia. El mensaje queda retenido hasta que el consumidor pueda procesarlo.
