# 🔹 Variable global para prefijo
variable "prefix" {
  description = "Prefijo para los recursos de AWS"
  type        = string
  default     = "DH_G2_final"
}

variable "db_password" {
  description = "Contraseña segura para la base de datos"
  type        = string
  sensitive   = true
}

variable "docker_registry_user" {}
variable "docker_registry_password" {}
variable "docker_image_backend" {}