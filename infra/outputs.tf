# 🔹 Output para ip de backend
output "backend_instance_ip" {
  description = "IP pública de la instancia EC2"
  value       = aws_instance.backend.public_ip
}

# 🔹 Output para obtener la URL de la base de datos
output "db_endpoint" {
  value = aws_db_instance.db.endpoint
}

# 🔹 Output para obtener la URL del frontend
output "frontend_url" {
  value = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

# 🔹 Output para obtener el nombre del bucket de imágenes
output "images_bucket_name" {
  value = aws_s3_bucket.images.id
}

# 🔹 Output para obtener la URL de las imágenes
output "frontend_bucket_arn" {
  value = aws_s3_bucket.frontend.arn
}
