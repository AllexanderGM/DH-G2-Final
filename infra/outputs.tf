output "backend_instance_ip" {
  description = "IP pública de la instancia EC2"
  value       = aws_instance.backend.public_ip
}
