provider "aws" {
  region = "us-east-1"
}

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

# 🔹 VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "${var.prefix}-VPC" }
}

# 🔹 Subred privada
resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = false # ❗ No asigna IP pública, solo accesible dentro de la VPC
  tags = { Name = "${var.prefix}-Private-Subnet" }
}

# 🔹 Subred pública
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true # ✅ Asigna IP pública automáticamente
  tags = { Name = "${var.prefix}-Public-Subnet" }
}

# 🔹 Tabla de rutas para subred pública
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id # ❗ Requiere Internet Gateway para permitir tráfico a Internet
  }
  tags = { Name = "${var.prefix}-Public-RT" }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}

# 🔹 Internet Gateway para acceso a Internet
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags = { Name = "${var.prefix}-GW" }
}

# 🔹 NAT Gateway para permitir acceso a Internet a instancias en subred privada
resource "aws_eip" "nat_eip" {}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public.id
  depends_on    = [aws_internet_gateway.gw] # ✅ Asegura que el Internet Gateway se cree primero
  tags = { Name = "${var.prefix}-NAT" }
}

# 🔹 Grupo de seguridad con reglas de entrada y salida
resource "aws_security_group" "sg" {
  name        = "${var.prefix}-SG"
  description = "Reglas de seguridad"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # ❗ Solo permite tráfico dentro de la VPC
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] # ✅ Permite salida a cualquier destino
  }
}

# 🔹 EC2 para backend
resource "aws_instance" "backend" {
  ami             = "ami-0c55b159cbfafe1f0" # ✅ AMI de Amazon Linux 2
  instance_type   = "t2.micro"
  key_name        = "mi-clave-aws" # ❗ Asegúrate de tener esta clave creada en AWS
  security_groups = [aws_security_group.sg.name]
  subnet_id       = aws_subnet.private.id # ❗ Está en la subred privada, sin acceso directo a Internet

  user_data = <<-EOF
    #!/bin/bash
    sudo yum update -y
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo docker run -d -p 8080:8080 usuario/backend # ❗ Reemplazar con imagen real de Docker Hub
  EOF

  tags = { Name = "${var.prefix}-Backend" }
}

# 🔹 Base de datos MySQL en RDS
resource "aws_db_instance" "db" {
  identifier           = "${var.prefix}-DB"
  allocated_storage    = 20
  engine              = "mysql"
  engine_version      = "8.0"
  instance_class      = "db.t3.micro"
  username           = "admin"
  password           = var.db_password
  publicly_accessible = false # ✅ No accesible desde Internet
  skip_final_snapshot = true
  vpc_security_group_ids = [aws_security_group.sg.id]
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name

  tags = { Name = "${var.prefix}-RDS" }
}

# 🔹 Subnet Group para RDS
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.prefix}-DB-Subnet-Group"
  subnet_ids = [aws_subnet.private.id, aws_subnet.public.id] # ❗ Es recomendable usar solo subredes privadas
  tags       = { Name = "${var.prefix}-DB-Subnet" }
}

# 🔹 Bucket S3 para frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.prefix}-frontend"
  tags   = { Name = "${var.prefix}-Frontend-S3" }
}

resource "aws_s3_bucket_public_access_block" "frontend_public" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false # ❗ Permite público, revisar configuraciones de seguridad
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }
}

# 🔹 Bucket S3 para imágenes
resource "aws_s3_bucket" "images" {
  bucket = "${var.prefix}-images"
  tags = { Name = "${var.prefix}-Images-S3" }
}
