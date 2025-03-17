module "vpc" {
  source             = "terraform-aws-modules/vpc/aws"
  version            = "5.19.0" # version latest
  name               = "${var.prefix}-vpc"
  cidr               = "10.0.0.0/16"
  azs                = var.availability_zone
  public_subnets     = var.public_subnet_cidrs
  private_subnets    = var.private_subnet_cidrs
  enable_nat_gateway = true
  single_nat_gateway = true
  tags               = { Name = "${var.prefix}-vpc" }
}

module "security_groups" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "5.3.0"
  vpc_id  = module.vpc.vpc_id
  prefix  = var.prefix
}

