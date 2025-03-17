# 🔹 EC2 para backend
module "ec2" {
  source            = "terraform-aws-modules/ec2-instance/aws"
  version           = "5.7.1"
  name              = "${var.prefix}-backend"
  instance_type     = "t2.micro"
  ami               = "ami-0c55b159cbfafe1f0" # Amazon Linux 2 (ajusta la AMI según región)
  key_name          = "mi-key"
  vpc_id            = module.vpc.vpc_id
  subnet_id         = module.vpc.private_subnet_ids[0] # Ahora usa el ID generado por el módulo
  security_group_id = module.security_groups.app_sg_id
  prefix            = var.prefix

  user_data = <<-EOF
    #!/bin/bash
    amazon-linux-extras enable docker
    yum install -y docker
    systemctl start docker
    systemctl enable docker
    usermod -aG docker ec2-user

    # Iniciar sesión en Docker Hub (si es necesario)
    echo "${var.docker_registry_password}" | docker login -u "${var.docker_registry_user}" --password-stdin

    # Descargar y ejecutar la imagen de Docker
    docker pull ${var.docker_image_backend}
    docker run -d -p 80:3000 ${var.docker_image_backend}
  EOF
}