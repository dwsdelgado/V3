---
title: "MobaXterm en Windows — Setup como terminal Linux"
date: 2026-06-03
description: "Configuración de MobaXterm en Windows para usar AWS CLI, SSH y SSM exactamente igual que en Linux."
tags: ["aws", "windows", "mobaxterm", "ssh", "ssm"]
draft: false
github_source: "https://github.com/dwsdelgado/Cloud-Infrastructure/blob/main/docs/mobaxterm-windows-setup.md"
---

MobaXterm provee un entorno bash en Windows con acceso al sistema de archivos
local. Con esta configuración puedes usar AWS CLI, SSH y SSM exactamente igual
que en Linux.

---

## 1. Cómo MobaXterm ve el disco C:

En MobaXterm el disco `C:\` se monta en `/drives/c/`. No uses `/mnt/c` ni `/c`.

```
Windows          →   MobaXterm
C:\Users\darwin  →   /drives/c/Users/darwin
C:\Program Files →   /drives/c/Program Files
```

---

## 2. Agregar AWS CLI al PATH

AWS CLI se instala en Windows en `C:\Program Files\Amazon\AWSCLIV2\`.
MobaXterm no lo detecta automáticamente — hay que agregarlo al PATH.

```bash
echo 'export PATH=$PATH:/drives/c/Program\ Files/Amazon/AWSCLIV2' >> ~/.bashrc
source ~/.bashrc
aws --version
```

Verificar que quedó:
```bash
which aws
# → /drives/c/Program Files/Amazon/AWSCLIV2/aws
```

---

## 3. Configurar perfiles AWS SSO

Si usas IAM Identity Center (SSO), el archivo de config vive en Windows en:
`C:\Users\<usuario>\.aws\config`

MobaXterm lo ve en:
```
/drives/c/Users/<usuario>/.aws/config
```

Para que AWS CLI encuentre ese archivo desde MobaXterm, apunta la variable HOME:
```bash
echo 'export AWS_CONFIG_FILE=/drives/c/Users/<tu-usuario>/.aws/config' >> ~/.bashrc
echo 'export AWS_SHARED_CREDENTIALS_FILE=/drives/c/Users/<tu-usuario>/.aws/credentials' >> ~/.bashrc
source ~/.bashrc
```

Verificar que funciona:
```bash
aws sts get-caller-identity --profile dwexec-dev
```

---

## 4. Conectarse a EC2 via SSM Session Manager

Requiere que el Session Manager Plugin esté instalado en Windows.
Con el PATH configurado, desde MobaXterm:

```bash
aws ssm start-session \
  --target i-XXXXXXXXXXXXXXXXX \
  --profile dwexec-dev \
  --region us-east-1
```

Obtener el Instance ID desde AWS CLI:
```bash
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=*ec2*" \
  --query "Reservations[].Instances[].{ID:InstanceId,Name:Tags[?Key=='Name']|[0].Value,State:State.Name}" \
  --output table \
  --profile dwexec-dev \
  --region us-east-1
```

---

## 5. Conectarse a EC2 via SSH

Desde MobaXterm puedes usar SSH directo con la key en Windows:

```bash
ssh -i "/drives/c/Users/<tu-usuario>/.ssh/tu-key.pem" ec2-user@<IP-PUBLICA>
```

Permisos de la key (SSH los exige):
```bash
chmod 400 "/drives/c/Users/<tu-usuario>/.ssh/tu-key.pem"
```

---

## 6. Verificaciones rápidas

```bash
# AWS CLI funcionando
aws --version

# Cuenta activa
aws sts get-caller-identity --profile dwexec-dev

# SSM Plugin instalado
session-manager-plugin --version

# Ver instancias EC2
aws ec2 describe-instances \
  --query "Reservations[].Instances[].{ID:InstanceId,State:State.Name,Name:Tags[?Key=='Name']|[0].Value}" \
  --output table \
  --profile dwexec-dev \
  --region us-east-1
```

---

## Resumen del PATH final en ~/.bashrc

```bash
# AWS CLI
export PATH=$PATH:/drives/c/Program\ Files/Amazon/AWSCLIV2

# AWS config files (apuntar a Windows)
export AWS_CONFIG_FILE=/drives/c/Users/<tu-usuario>/.aws/config
export AWS_SHARED_CREDENTIALS_FILE=/drives/c/Users/<tu-usuario>/.aws/credentials
```

Después de editar `.bashrc` siempre correr:
```bash
source ~/.bashrc
```
