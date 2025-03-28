module "rds" {
  source     = "terraform-aws-modules/rds/aws"
  version    = "6.11.0"
  identifier = replace(lower("${var.prefix}-db"), "_", "-")

  engine               = "mysql"
  engine_version       = "8.0"
  family               = "mysql8.0"
  major_engine_version = "8.0"
  instance_class       = "db.t3.micro"

  db_name  = var.db_name
  username = var.db_user
  password = var.db_password
  port     = var.db_port

  # 20GB es el límite para capa gratuita
  allocated_storage = 20
  storage_type      = "gp2"

  publicly_accessible = false
  storage_encrypted   = false

  create_db_subnet_group = true
  db_subnet_group_name   = replace(lower("${var.prefix}-subnet-group"), "_", "-")

  subnet_ids = [
    module.vpc.private_subnets[0],
    module.vpc.private_subnets[1]
  ]

  vpc_security_group_ids = [module.security_groups.security_group_id]

  # Configuraciones para mantenerse dentro de la capa gratuita
  multi_az                = false
  backup_retention_period = 0

  skip_final_snapshot = true
  deletion_protection = false

  create_db_option_group    = true
  create_db_parameter_group = true

  option_group_name    = replace(lower("${var.prefix}-option-group"), "_", "-")
  parameter_group_name = replace(lower("${var.prefix}-parameter-group"), "_", "-")

  tags = {
    Name         = replace(lower("${var.prefix}-rds"), "_", "-")
    Project      = replace(lower(var.prefix), "_", "-")
    Environment  = "Production"
    ManagedBy    = "Terraform"
    ResourceType = "Database"
  }
}