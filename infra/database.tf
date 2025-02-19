
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