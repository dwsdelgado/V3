---
title: "Cómo monté un CDN con CloudFront y WAF usando Terraform"
date: 2026-06-01
description: "Paso a paso de cómo construí una distribución CloudFront con WAF, logs y sincronización automática desde S3, todo gestionado con Terraform."
tags: ["aws", "terraform", "cloudfront", "waf"]
draft: false
---

Llevaba tiempo queriendo documentar cómo armé el CDN de este sitio. Todo está manejado con Terraform y corre en AWS. Acá va el proceso.

![Arquitectura del CDN](/images/ssm-ec2-arquitectura.png)
*Arquitectura: S3 → CloudFront → WAF → usuario final*

## El problema

Tenía un bucket S3 con activos estáticos, pero servir directo desde S3 tiene varios problemas: latencia, sin HTTPS propio, sin control de caché, sin WAF.

## La solución

CloudFront resuelve todo eso. Puse WAF delante para bloquear requests maliciosas y activé access logs para tener visibilidad.

## La estructura en Terraform

```hcl
resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id   = "s3-assets"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-assets"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }

  web_acl_id = aws_wafv2_web_acl.main.arn

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.main.arn
    ssl_support_method  = "sni-only"
  }
}
```

## WAF con reglas administradas

```hcl
resource "aws_wafv2_web_acl" "main" {
  name  = "cdn-waf"
  scope = "CLOUDFRONT"

  default_action { allow {} }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action { none {} }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSet"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "cdn-waf"
    sampled_requests_enabled   = true
  }
}
```

## Sincronización automática desde S3

Para subir los archivos automáticamente uso un script bash que compara checksums antes de subir:

```bash
#!/bin/bash
BUCKET="s3://mi-bucket-assets"
LOCAL_DIR="./dist"

aws s3 sync "$LOCAL_DIR" "$BUCKET" \
  --delete \
  --cache-control "max-age=31536000,public" \
  --exclude "*.html"

# HTML sin caché para que CloudFront siempre sirva la versión fresca
aws s3 sync "$LOCAL_DIR" "$BUCKET" \
  --exclude "*" \
  --include "*.html" \
  --cache-control "no-cache,no-store,must-revalidate"

# Invalidar la distribución
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_ID" \
  --paths "/*"
```

## Resultado

Latencia desde Colombia bajó de ~400ms (S3 directo) a ~35ms. WAF bloqueó un par de crawlers agresivos el primer día. Los logs en S3 me dan visibilidad completa.

Todo el código está en mi repositorio de infraestructura.
