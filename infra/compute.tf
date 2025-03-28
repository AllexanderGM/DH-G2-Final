# 🔹 SSH Private Key para Instancia EC2
resource "local_file" "private_key" {
  content         = tls_private_key.ssh_key.private_key_pem
  filename        = "${path.module}/.ec2-key.pem"
  file_permission = "0600"
}

# 🔹 EC2 para backend
module "ec2" {
  source                 = "terraform-aws-modules/ec2-instance/aws"
  version                = "5.7.1"
  name                   = replace(lower("${var.prefix}-backend"), "_", "-")
  instance_type          = "t2.micro"
  ami                    = "ami-0cff7528ff583bf9a" # Amazon Linux 2 en us-east-1
  key_name               = aws_key_pair.generated.key_name
  vpc_security_group_ids = [module.security_groups.security_group_id]
  subnet_id              = module.vpc.private_subnets[0]

  tags = {
    Name         = replace(lower("${var.prefix}-backend"), "_", "-")
    Project      = replace(lower(var.prefix), "_", "-")
    Environment  = "Production"
    ManagedBy    = "Terraform"
    ResourceType = "Backend"
  }

  user_data = <<-EOF
                            #!/bin/bash
                            sudo apt update -y
                            sudo apt install -y docker.io
                            sudo systemctl enable docker
                            sudo systemctl start docker
                            EOF
}