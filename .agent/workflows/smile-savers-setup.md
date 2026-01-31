---
description: Set up and develop Smile Savers dental practice website with premium mobile UI
---

# Smile Savers Development Workflow (Astro + Tailwind v4)

This workflow sets up the Astro project with Tailwind CSS v4, Vite, and DaisyUI.

## Steps

// turbo-all

### 1. Create Astro Project (Latest Stable)

```powershell
cd "C:\New Smile Savers"
npm create astro@latest smile-savers-site -- --template minimal --typescript strict --git --install --yes
```

### 2. Navigate to Project

```powershell
cd "C:\New Smile Savers\smile-savers-site"
```

### 3. Install Dependencies (Tailwind v4 + DaisyUI)

```powershell
npm install tailwindcss @tailwindcss/vite daisyui@latest
```

### 4. Configure Vite (astro.config.mjs)

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### 5. Create Styles Directory

```powershell
New-Item -ItemType Directory -Force -Path ".\src\styles"
```

### 6. Copy CSS Configuration

```powershell
Copy-Item "C:\New Smile Savers\.agent\skills\smile-savers-mobile-ui\resources\global.css" -Destination ".\src\styles\global.css"
```

### 7. Create Layout and Import CSS

```astro
// src/layouts/BaseLayout.astro
---
import '../styles/global.css';
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Smile Savers Dental</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### 8. Create Components Directories

```powershell
New-Item -ItemType Directory -Force -Path ".\src\components\cards"
New-Item -ItemType Directory -Force -Path ".\src\components\grids"
New-Item -ItemType Directory -Force -Path ".\src\components\icons"
```

### 9. Copy Skill Components

```powershell
Copy-Item "C:\New Smile Savers\.agent\skills\smile-savers-mobile-ui\examples\ServiceCardPremium.astro" -Destination ".\src\components\cards\"
Copy-Item "C:\New Smile Savers\.agent\skills\smile-savers-mobile-ui\examples\ServiceGridPremium.astro" -Destination ".\src\components\grids\"
Copy-Item "C:\New Smile Savers\.agent\skills\smile-savers-mobile-ui\examples\TeamCard.astro" -Destination ".\src\components\cards\"
Copy-Item "C:\New Smile Savers\.agent\skills\smile-savers-mobile-ui\examples\TestimonialCard.astro" -Destination ".\src\components\cards\"
Copy-Item "C:\New Smile Savers\.agent\skills\smile-savers-mobile-ui\resources\icons.svg" -Destination ".\public\icons.svg"
```

### 10. Start Development Server

```powershell
npm run dev
```

## Verification

1. Verify `astro.config.mjs` has `tailwindcss()` plugin.
2. Verify `src/styles/global.css` has `@import "tailwindcss";` and `@theme`.
3. Check `npm list tailwindcss` shows v4.x.
