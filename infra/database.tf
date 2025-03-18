
# 🔹 Base de datos MySQL en RDS
module "rds" {
  source            = "terraform-aws-modules/rds/aws"
  version           = "6.10.0"
  name              = "${var.prefix}-db"
  engine            = "mysql"
  engine_version    = "8.0"
  db_name           = var.db_name
  db_user           = var.db_user
  db_password       = var.db_password
  db_port           = var.db_port
  vpc_id            = module.vpc.vpc_id
  db_subnet_ids     = module.vpc.private_subnet_ids
  security_group_id = module.security_groups.rds_sg_id
  tags              = { Name = "${var.prefix}-rds" }
}
