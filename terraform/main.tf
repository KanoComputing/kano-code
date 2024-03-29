/*
Copyright (C) 2016-2020 Kano Computing Ltd.
License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
*/
# Using this module

# Download the current ip ranges for cloudfront and only allow acccess to the bucket from those ip ranges
data "http" "json_data" {
    url = "http://d7uri8nf7uskq.cloudfront.net/tools/list-cloudfront-ips"

    # Optional request headers
    request_headers {
       "Accept" = "application/json"
    }
}

# Terraform doesn't support jsondecode yet. Comming in v0.12
# https://goo.gl/NmFYch
# So for now we have to work with json directly.
# { CLOUDFRONT_GLOBAL_IP_LIST: [<list of ip ranges>]], CLOUDFRONT_REGIONAL_EDGE_IP_LIST: [<list of ip ranges>] }
locals {
  # Get rid of the quotes.
  req_data = "${replace(data.http.json_data.body, "/\"/", "")}"
  # Chop the string in to 3 parts [
    #   "{ CLOUDFRONT_GLOBAL_IP_LIST: [",
    #   "<list of ip ranges>]], CLOUDFRONT_REGIONAL_EDGE_IP_LIST: [",
    #   "<list of ip ranges>]" }
    # ]
  ips_parts = "${split("[", local.req_data)}"
  # Pull out just the two <list of ip ranges> from the arrays
  ips_parts_1 = "${split("]",local.ips_parts[1])}"
  ips_parts_2 = "${split("]",local.ips_parts[2])}"
  # split the strings into two terrafrom lists of single ip ranges and concatonate them
  cf_ips = "${concat(split(",", local.ips_parts_1[0]), split(",", local.ips_parts_2[0]))}"
 
}

terraform {
  backend "s3" {
    bucket = "terraform.kano"
    key =  "code-docs/terraform.tfstate"
    region =  "eu-west-1"
  }
}
output "cf_ips" {
    value = "${local.cf_ips}"
}

module "main" {
  source = "git@github.com:KanoComputing/kes-terraform-modules//modules/aws/s3-cloudfront-website"

  fqdn = "${var.fqdn}"
  ssl_certificate_arn = "${aws_acm_certificate_validation.cert.certificate_arn}"
  allowed_ips = "${local.cf_ips}"

  index_document = "index.html"
  error_document = "404.html"

  refer_secret = "${base64sha512("REFER-SECRET-19265125-${var.fqdn}-52865926")}"

  force_destroy = "true"

  providers {
    "aws.main" = "aws.main"
  }

}