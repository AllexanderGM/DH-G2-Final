module "frontend_bucket" {
  source                  = "terraform-aws-modules/s3-bucket/aws"
  version                 = "4.6.0"
  bucket                  = "${var.prefix}-frontend"
  acl                     = "public-read"
  force_destroy           = true
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

  tags = { Name = "${var.prefix}-frontend" }
}

module "images_bucket" {
  source                  = "terraform-aws-modules/s3-bucket/aws"
  version                 = "4.6.0"
  bucket                  = "${var.prefix}-images"
  acl                     = "public-read"
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
  tags                    = { Name = "${var.prefix}-images" }
}
