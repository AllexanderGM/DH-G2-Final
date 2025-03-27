# 🔹 
resource "local_file" "private_key" {
  content  = tls_private_key.ssh_key.private_key_pem
  filename = "${path.module}/.generated_key.pem"
  file_permission = "0600"
}

# 🔹 EC2 para backend
module "ec2" {
  source                  = "terraform-aws-modules/ec2-instance/aws"
  version                 = "5.7.1"
  name                    = "${var.prefix}-backend"
  instance_type           = "t2.micro"
  ami                     = "ami-0c55b159cbfafe1f0" # Amazon Linux 2 (ajusta la AMI según región)
  key_name                = aws_key_pair.generated.key_name
  vpc_id                  = module.vpc.vpc_id
  vpc_security_group_ids  = [module.security_groups.app_sg_id]
  subnet_id               = module.vpc.private_subnet_ids[0] # Ahora usa el ID generado por el módulo
  prefix                  = var.prefix
  tags                    = { Name = "${var.prefix}-backend" }
}