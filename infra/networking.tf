module "vpc" {
  source             = "terraform-aws-modules/vpc/aws"
  version            = "5.19.0"
  name               = replace(lower("${var.prefix}-vpc"), "_", "-")
  cidr               = "10.0.0.0/16"
  azs                = var.availability_zone
  public_subnets     = var.public_subnet_cidrs
  private_subnets    = var.private_subnet_cidrs
  enable_nat_gateway = true
  single_nat_gateway = true # Un solo NAT Gateway para ahorrar costos

  tags = {
    Name         = replace(lower("${var.prefix}-vpc"), "_", "-")
    Project      = replace(lower(var.prefix), "_", "-")
    Environment  = "Production"
    ManagedBy    = "Terraform"
    ResourceType = "VPC"
  }
}

module "security_groups" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "5.3.0"
  name    = replace(lower("${var.prefix}-sg"), "_", "-")
  vpc_id  = module.vpc.vpc_id

  tags = {
    Name         = replace(lower("${var.prefix}-sg"), "_", "-")
    Project      = replace(lower(var.prefix), "_", "-")
    Environment  = "Producción"
    ManagedBy    = "Terraform"
    ResourceType = "Security Group"
  }

  # Agregar reglas de ingreso y egreso si es necesario
  ingress_with_cidr_blocks = [
    {
      from_port   = 8080
      to_port     = 8080
      protocol    = "tcp"
      description = "Backend port"
      cidr_blocks = "0.0.0.0/0"
    }
  ]

  egress_with_cidr_blocks = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      description = "Allow all outbound traffic"
      cidr_blocks = "0.0.0.0/0"
    }
  ]
}
