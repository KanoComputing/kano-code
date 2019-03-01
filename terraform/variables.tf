# Variables
variable "fqdn" {
  description = "The fully-qualified domain name of the resulting S3 website."
  default     = "code-docs.kano.me"
}

variable "domain" {
  description = "The domain name / ."
  default     = "kano.me"
}