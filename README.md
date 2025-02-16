## Backend

# Endpoints

 - (POST) http://localhost:8080/paquetes

```json
     {
    "nombre":"Machu Picchu",
    "descripcion": "Viaje cultural, una aventura que incluye visitas a ruinas incas, caminatas por montañas y observación de animales y aves que habitan",
    "duracion":3,
    "destino":"Parú",
    "precio":6000.0,
    "fechaProgramacion":"2025-10-10",
    "categoria":"Cultural",
    "proveedores":[
        "Hotel 5 estrellas",
        "Agencia de Viajes y Turismo"
    ],
    "imagenes": [
        "https://i.pinimg.com/736x/72/af/ca/72afcae3b7f498fb166e831d78032e44.jpg",
        "https://i.pinimg.com/736x/a0/e6/5e/a0e65e336fd8a72e84bc795c94fe81d8.jpg"
    ]
 }
 ```
 - (GET) http://localhost:8080/paquetes/1
 - (GET) http://localhost:8080/paquetes/aleatorios