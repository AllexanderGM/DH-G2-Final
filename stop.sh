#!/bin/bash

echo "Deteniendo y eliminando contenedores, imágenes y redes sin afectar los volúmenes..."

# Detiene y elimina contenedores, elimina imágenes sin uso y redes
docker-compose down --rmi all --remove-orphans

echo "Proceso completado. Los volúmenes permanecen intactos."
