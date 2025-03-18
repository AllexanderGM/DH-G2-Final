#!/bin/bash

set -e # Detener ejecución si ocurre un error

### VARIABLES Y VALIDACIONES ###

# Verificar si el archivo .env.prod base existe
if [[ ! -f .env.prod ]]; then
    echo "❌ Error: El archivo .env.prod existe en la raíz del proyecto."
    exit 1
fi

# Cargar variables de entorno del archivo .env.prod
set -a
source .env.prod
set +a

### CONFIGURACIÓN DE RUTAS ###
FRONTEND_ENV_PATH="./frontend/.env"
BACKEND_ENV_PATH="./backend/.env"
INFRA_ENV_PATH="./infra/terraform.tfvars"

# Concatenar las variables de entorno para las URLs
if [[ $URL == "http://localhost" ]]; then
    URL_FRONT="$URL:$PORT_FRONT"
    URL_BACK="$URL:$PORT_BACK"
else
    URL_FRONT="$URL"
    URL_BACK="$URL"
fi

### FUNCIONES ###

# Función para crear el .env del frontend
create_frontend_env() {
    echo "📂 Creando archivo .env para el frontend en $FRONTEND_ENV_PATH..."
    cat <<EOL >"$FRONTEND_ENV_PATH"
# Variables de entorno Generales
VITE_NAME=$NAME
VITE_NODE_ENV=$ENV

# Variables de archivos estáticos
VITE_STATIC_FILE_PATH=$STATIC_FILE_PATH

# Configuración de URLs
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
}

# Función para crear el .env del backend
create_backend_env() {
    # Definir DB_HOST para el perfil "front"
    [[ "$PROFILE" == "front" ]] && DB_HOST="localhost"

    echo "📂 Creando archivo .env para el backend en $BACKEND_ENV_PATH..."
    cat <<EOL >"$BACKEND_ENV_PATH"
# Variables de entorno Generales
NAME=$NAME
NODE_ENV=$ENV

# Configuración de URLs
PORT_FRONT=$PORT_FRONT
PORT_BACK=$PORT_BACK
URL_FRONT=$URL_FRONT
URL_BACK=$URL_BACK

# Configuración de Base de Datos
DB_PORT=$DB_PORT
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_ROOT_PASSWORD=$DB_ROOT_PASSWORD
DB_NAME=$DB_NAME

# Configuración de almacenamiento (MinIO)
MINIO_PORT=$MINIO_PORT
MINIO_PORT_WEB=$MINIO_PORT_WEB
MINIO_WEB=$MINIO_HOST:$MINIO_PORT_WEB
MINIO_ENDPOINT=$MINIO_HOST:$MINIO_PORT
MINIO_ROOT_USER=$MINIO_ROOT_USER
MINIO_ROOT_PASSWORD=$MINIO_ROOT_PASSWORD
MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY
MINIO_SECRET_KEY=$MINIO_SECRET_KEY
MINIO_BUCKET=$MINIO_BUCKET

# Variables de encriptación
ALGORITHM=$ALGORITHM
KEY=$KEY
IV=$IV

# Configuración de sesión y autenticación
SESSION_SECRET=$SESSION_SECRET
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=$JWT_EXPIRATION
ADMIN_USERNAME=$ADMIN_USERNAME
ADMIN_PASSWORD=$ADMIN_PASSWORD
EOL
}

### EJECUCIÓN ###
create_frontend_env
create_backend_env

echo "✅ Archivos .env creados exitosamente"

echo "🎉 Proceso completado."
