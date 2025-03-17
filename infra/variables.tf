# 🔹 Variable global para prefijo

variable "prefix" {
  description = "Prefijo para los recursos de AWS"
  type        = string
  default     = "DH_G2_final"
}

# 🔹 Variables para la conexión con AWS
variable "aws_access_key" {
  description = "Clave de acceso de AWS"
  type        = string
  sensitive   = true
}

variable "aws_secret_key" {
  description = "Clave secreta de AWS"
  type        = string
  sensitive   = true
}

# 🔹 Variables para la región y zona de disponibilidad
variable "region" {
  description = "Región de AWS"
  type        = string
  default     = "us-east-1"
}

variable "availability_zone" {
  description = "Zona de disponibilidad de AWS"
  type        = list(string)
  default     = ["us-east-1a"]
}

# 🔹 Variables para las subredes
variable "public_subnet_cidrs" {
  description = "CIDR Blocks para las subredes públicas"
  type        = list(string)
  default     = ["10.0.1.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR Blocks para las subredes privadas"
  type        = list(string)
  default     = ["10.0.2.0/24"]
}

# 🔹 Variables para la base de datos
variable "db_name" {
  type        = string
  description = "Nombre de la base de datos"
}

variable "db_user" {
  description = "Usuario para la base de datos"
  type        = string
}

variable "db_password" {
  description = "Contraseña segura para la base de datos"
  type        = string
  sensitive   = true
}

variable "db_port" {
  description = "Puerto para la base de datos"
  type        = number
  default     = 3306
}

# 🔹 Variables para el registro de Docker
variable "docker_registry_user" {
  description = "Usuario para el registro de Docker"
  type        = string
}

variable "docker_registry_password" {
  description = "Contraseña segura para el registro de Docker"
  type        = string
  sensitive   = true
}

variable "docker_image_backend" {
  description = "Imagen de Docker para el backend"
  type        = string
}