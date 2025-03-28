module "frontend_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "4.6.0"
  bucket  = "${lower(replace(var.prefix, "_", "-"))}-frontend-${random_id.bucket_suffix.hex}"

  force_destroy = true # Permite eliminar el bucket incluso si no está vacío

  # Configuraciones de acceso público
  acl                     = null
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"

  # Configuración de sitio web estático
  website = {
    index_document = "index.html"
    error_document = "error.html"
  }

  tags = {
    Name         = "${lower(replace(var.prefix, "_", "-"))}-frontend"
    Project      = replace(lower(var.prefix), "_", "-")
    Environment  = "Production"
    ManagedBy    = "Terraform"
    ResourceType = "S3 Bucket"
  }
}

module "images_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "4.6.0"
  bucket  = "${lower(replace(var.prefix, "_", "-"))}-images-${random_id.bucket_suffix.hex}"

  force_destroy = true

  # Misma configuración que frontend_bucket
  acl                     = null
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"

  tags = {
    Name         = "${lower(replace(var.prefix, "_", "-"))}-images"
    Project      = replace(lower(var.prefix), "_", "-")
    Environment  = "Production"
    ManagedBy    = "Terraform"
    ResourceType = "S3 Bucket"
  }
}

# Añade este recurso para generar un sufijo único para los buckets
resource "random_id" "bucket_suffix" {
  byte_length = 8
}