# Cómo publicar contenido en el portafolio

## Nuevo post de blog

**1. Crea el archivo en `src/content/blog/`**

El nombre del archivo define la URL:
```
src/content/blog/ansible-playbooks-basicos.md
→ darwindelgado.com/blog/ansible-playbooks-basicos
```

**2. Frontmatter obligatorio al inicio del archivo**

```yaml
---
title: "Cómo automatizar deploys con Ansible"
date: 2025-06-10
description: "Guía práctica de playbooks de Ansible para automatizar configuraciones en servidores RHEL."
tags: ["ansible", "linux", "automatización"]
draft: false
---

Acá empieza el contenido del post en Markdown...
```

| Campo | Requerido | Descripción |
| --- | --- | --- |
| `title` | ✅ | Título del post |
| `date` | ✅ | Fecha en formato `YYYY-MM-DD` |
| `description` | ✅ | Descripción corta para SEO |
| `tags` | no | Array de etiquetas, aparecen al final del post |
| `draft` | no | `true` = no se publica (borrador). Default: `false` |
| `github_source` | no | URL del repo, muestra "View source ↗" al pie |

**3. El post aparece automáticamente** en `/blog` ordenado por fecha. No hay que tocar ningún otro archivo.

---

## Borradores

Pon `draft: true` para trabajar en un post sin publicarlo:

```yaml
---
title: "Mi post en progreso"
date: 2025-06-15
description: "..."
draft: true
---
```

Cambia a `draft: false` cuando esté listo.

---

## Tags recomendados

```yaml
tags: ["linux"]
tags: ["ansible"]
tags: ["aws"]
tags: ["terraform"]
tags: ["docker"]
tags: ["kubernetes"]
tags: ["azure"]
tags: ["networking"]
tags: ["grafana"]
tags: ["rhel"]
tags: ["bash"]
tags: ["ci-cd"]
```

Puedes combinar varios: `tags: ["aws", "terraform", "cloudfront"]`

---

## Agregar una nueva entrada al ls -l de la home

Abre `src/pages/index.astro` y agrega una entrada al array `entries`:

```ts
// Página interna
{
  perms: 'drwxr-xr-x',
  links: 2,
  size: 4096,
  date: new Date('2025-06-10'),
  name: 'projects/',
  href: '/projects',
},

// PDF
{
  perms: '-rw-r--r--',
  links: 1,
  size: 94200,
  date: new Date('2025-06-10'),
  name: 'darwin_delgado_certificaciones.pdf',
  href: '/darwin_delgado_certificaciones.pdf',
},

// Link externo
{
  perms: 'drwxr-xr-x',
  links: 2,
  size: 4096,
  date: new Date('2025-06-10'),
  name: 'twitter/',
  href: 'https://twitter.com/dwsdelgado',
  external: true,
},
```

Luego suma 1 a `const total` para que el contador cuadre.

---

## Desplegar cambios

```bash
git add .
git commit -m "blog: nuevo post sobre ansible"
git push origin main
```

Cloudflare Pages despliega automáticamente al hacer push a `main`.
