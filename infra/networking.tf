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


# 🔹 Subnet Group para RDS
resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "${var.prefix}-DB-Subnet-Group"
  subnet_ids = [aws_subnet.private.id, aws_subnet.public.id] # ❗ Es recomendable usar solo subredes privadas
  tags       = { Name = "${var.prefix}-DB-Subnet" }
}

