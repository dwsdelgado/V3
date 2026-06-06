# Darwin Delgado — Portfolio V3

<div align="center">
  <img alt="Preview del portafolio" src="public/og-preview.png" width="800" />
</div>

<br />

Portafolio personal V3 construido con Astro, Tailwind CSS y desplegado en Cloudflare Pages. La página de inicio simula una terminal con `ls -l`, desde donde se navega al blog, CVs, GitHub y LinkedIn.

## Cómo funciona

### Página de inicio — terminal `ls -l`

`src/pages/index.astro` genera una lista de entradas estilo terminal. Cada entrada es un objeto con permisos, tamaño, fecha, nombre y enlace. Para agregar una nueva sección (notas, proyectos, etc.) solo añade una entrada al array `entries`:

```ts
{
  perms: 'drwxr-xr-x',
  links: 2,
  size: 4096,
  date: new Date('2025-01-01'),
  name: 'projects/',
  href: '/projects',
}
```

Actualiza también la constante `total` para que el contador coincida.

### Blog

Los posts van en `src/content/blog/` como archivos `.md` con este frontmatter:

```yaml
---
title: "Título del post"
date: 2025-06-01
description: "Descripción corta"
tags: ["aws", "terraform"]
draft: false          # true = no se publica
github_source: "https://github.com/..."  # opcional
---
```

Al agregar un `.md`, aparece automáticamente en `/blog` ordenado por fecha. La entrada `blog/` en el `ls -l` refleja la fecha del post más reciente.

### Notas

Las notas van en `src/content/notes/` con frontmatter más simple:

```yaml
---
title: "Título"
date: 2025-06-02
tags: ["linux"]
---
```

Accesibles en `/notes`.

### Datos del perfil

Edita los archivos en `src/data/` para actualizar el contenido:

- **`me.json`** — Información personal, descripción, redes, CVs, tecnologías
- **`experience.json`** — Experiencia laboral
- **`projects.json`** — Proyectos
- **`certifications.json`** — Certificaciones
- **`links.json`** — Redes sociales

### CVs

Los PDFs van en `public/`. Actualmente:

- `darwin_delgado_resume_en.pdf` — CV en inglés
- `darwin_delgado_resumen_es.pdf` — CV en español

Para cambiarlos, reemplaza los archivos en `public/` y actualiza las entradas correspondientes en `src/pages/index.astro`.

## Inicio rápido

```bash
pnpm install
pnpm dev
```

El sitio estará disponible en `http://localhost:4321`

## Scripts disponibles

| Comando | Acción |
| :--- | :--- |
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Genera el sitio en `./dist/` |
| `pnpm preview` | Vista previa del build con Wrangler |

## Despliegue en Cloudflare Pages

1. Sube el proyecto a GitHub
2. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages → Create → Pages
3. Conecta el repositorio de GitHub
4. Configura el build:
   - **Framework**: Astro
   - **Build command**: `pnpm build`
   - **Output directory**: `dist`
5. Deploy — cualquier push a `main` despliega automáticamente

## Contacto

- **LinkedIn**: [dwsdelgado](https://linkedin.com/in/dwsdelgado)
- **GitHub**: [@dwsdelgado](https://github.com/dwsdelgado)
