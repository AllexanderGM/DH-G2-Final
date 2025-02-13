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
  map_public_ip_on_launch = false
  tags = { Name = "${var.prefix}-Private-Subnet" }
}

# 🔹 Internet Gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags = { Name = "${var.prefix}-GW" }
}

# 🔹 NAT Gateway
resource "aws_eip" "nat_eip" {}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.private.id
  depends_on    = [aws_internet_gateway.gw]
  tags = { Name = "${var.prefix}-NAT" }
}

# 🔹 Grupo de seguridad
resource "aws_security_group" "sg" {
  name        = "${var.prefix}-SG"
  description = "Reglas de seguridad"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # Solo dentro de la VPC
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 🔹 EC2 para backend
resource "aws_instance" "backend" {
  ami             = "ami-0c55b159cbfafe1f0"
  instance_type   = "t2.micro"
  key_name        = "mi-clave-aws"
  security_groups = [aws_security_group.sg.name]
  subnet_id       = aws_subnet.private.id

  user_data = <<-EOF
    #!/bin/bash
    sudo yum update -y
    sudo yum install -y docker
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo docker run -d -p 8080:8080 usuario/backend
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
  publicly_accessible = false
  skip_final_snapshot = true
  vpc_security_group_ids = [aws_security_group.sg.id]
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name

  tags = { Name = "${var.prefix}-RDS" }
}

# 🔹 Subnet Group para RDS
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.prefix}-DB-Subnet-Group"
  subnet_ids = [aws_subnet.private.id]
  tags = { Name = "${var.prefix}-DB-Subnet" }
}

# 🔹 Bucket S3 para frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.prefix}-frontend"
  tags = { Name = "${var.prefix}-Frontend-S3" }
}

# 🔹 Bucket S3 para imágenes
resource "aws_s3_bucket" "images" {
  bucket = "${var.prefix}-images"
  tags = { Name = "${var.prefix}-Images-S3" }
}
