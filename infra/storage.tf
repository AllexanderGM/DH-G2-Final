# 🔹 Bucket S3 para frontend
resource "aws_s3_bucket" "frontend" {
  bucket = "${var.prefix}-frontend"
  tags   = { Name = "${var.prefix}-Frontend-S3" }
}

resource "aws_s3_bucket_public_access_block" "frontend_public" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false # ❗ Permite público, revisar configuraciones de seguridad
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}


# 🔹 Bucket S3 para imágenes
resource "aws_s3_bucket" "images" {
  bucket = "${var.prefix}-images"
  tags = { Name = "${var.prefix}-Images-S3" }
}
