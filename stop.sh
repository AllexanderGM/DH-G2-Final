#!/bin/bash

# Verificar si el archivo .env existe en la raíz
if [ ! -f .env ]; then
    echo "El archivo .env no existe en la raíz del proyecto."
    exit 1
fi

set -a
source .env
set +a

echo "Deteniendo contenedores..."

docker-compose -p $NAME down
docker ps -a --filter "name=$NAME"

echo "Proceso completado."
