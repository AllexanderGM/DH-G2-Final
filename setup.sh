#!/bin/bash

# Verificar si el archivo .env existe en la raíz
if [ ! -f .env ]; then
  echo "El archivo .env no existe en la raíz del proyecto."
  exit 1
fi

# Cargar las variables de entorno desde el archivo .env en la raíz
# export $(grep -v '^#' .env | xargs -d '\n')

set -a
source .env
set +a

# Concatenar las variables de entorno para las URLs
if [[ $URL == "http://localhost" ]]; then
  URL_FRONT="$URL:$PORT_FRONT"
  URL_BACK="$URL:$PORT_BACK"
else
  URL_FRONT="$URL"
  URL_BACK="$URL"
fi

# Rutas de los archivos .env para frontend y backend
FRONTEND_ENV_PATH="./frontend/.env"
BACKEND_ENV_PATH="./backend/.env"

# Crear el archivo .env para el frontend con Vite
echo "Creando archivo .env para el frontend en $FRONTEND_ENV_PATH"
cat <<EOL >$FRONTEND_ENV_PATH
# Variables de entorno Generales
VITE_NAME=$NAME
VITE_NODE_ENV=$ENV

# Variables de archivos estáticos
VITE_STATIC_FILE_PATH=$STATIC_FILE_PATH

# Variables de entorno Generales
VITE_URL=$URL
VITE_PORT_FRONT=$PORT_FRONT
VITE_PORT_BACK=$PORT_BACK
VITE_URL_FRONT=$URL_FRONT
VITE_URL_BACK=$URL_BACK

# Variables de encriptación
VITE_ALGORITHM=$ALGORITHM
VITE_KEY=$KEY
VITE_IV=$IV
EOL

# Crear el archivo .env para el backend
echo "Creando archivo .env para el backend en $BACKEND_ENV_PATH"
cat <<EOL >$BACKEND_ENV_PATH
# Variables de entorno Generales
NAME=$NAME
NODE_ENV=$ENV

# Variables del sitio web
URL=$URL
URL_FRONT=$URL:$PORT_FRONT
URL_BACK=$URL:$PORT_BACK
PORT_FRONT=$PORT_FRONT
PORT_BACK=$PORT_BACK

# Variables de archivos estáticos
STATIC_FILE_PATH=$STATIC_FILE_PATH

# Variables de conexión a la base de datos
DB_PORT=$DB_PORT
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_ROOT_PASSWORD=$DB_ROOT_PASSWORD
DB_NAME=$DB_NAME

# Variables de encriptación
ALGORITHM=$ALGORITHM
KEY=$KEY
IV=$IV

# Variables de sesión de usuarios
SESSION_SECRET=$SESSION_SECRET
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=$JWT_EXPIRATION
ADMIN_USERNAME=$ADMIN_USERNAME
ADMIN_PASSWORD=$ADMIN_PASSWORD
EOL

echo "Archivos .env creados exitosamente"

# Ejecutar docker-compose up con build
echo "Iniciando Docker Compose..."

# Detener y eliminar contenedores, manteniendo los volúmenes
docker-compose down --rmi all
# Construir y levantar contenedores en segundo plano
docker-compose up --build -d
# Mostrar el estado de los contenedores
docker-compose ps
