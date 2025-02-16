# 🔹 EC2 para backend
resource "aws_instance" "backend" {
  ami             = "ami-0c55b159cbfafe1f0" # ✅ AMI de Amazon Linux 2
  instance_type   = "t2.micro"
  key_name        = "mi-clave-aws" # ❗ Asegúrate de tener esta clave creada en AWS
  security_groups = [aws_security_group.sg.id]
  subnet_id       = aws_subnet.private.id # ❗ Está en la subred privada, sin acceso directo a Internet

  user_data = <<-EOF
    #!/bin/bash
    set -ex

    # 🔹 Actualizar paquetes
    sudo yum update -y

    # 🔹 Instalar Docker y permitir ejecución sin sudo
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ec2-user

    # 🔹 Instalar docker-compose (opcional)
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose

    # 🔹 Autenticación en GitHub Container Registry (GHCR)
    echo "${var.docker_registry_password}" | docker login -u "${var.docker_registry_user}" --password-stdin

    # 🔹 Descargar y ejecutar el contenedor del backend
    docker pull ${var.docker_image_backend}
    docker run -d -p 8080:8080 --name backend ${var.docker_image_backend}
  EOF

  tags = { Name = "${var.prefix}-Backend" }
}