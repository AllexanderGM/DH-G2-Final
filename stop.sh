#!/bin/bash

echo "Deteniendo y eliminando contenedores, imágenes y redes sin afectar los volúmenes..."

docker-compose down --rmi all --remove-orphans || true
docker ps -aq | xargs docker rm -f || true
docker images -q | xargs docker rmi -f || true
docker network prune -f || true
docker volume prune -f || true

echo "Proceso completado. Los volúmenes permanecen intactos."
