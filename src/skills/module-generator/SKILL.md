---
name: multi-module-generator
description: Use this skill when the user asks to create a new section or module (e.g., /blog, /docs) using Astro 6 standards.
---

# Multi-Module Generator (Astro 6)

This skill guides the creation of modular, typesafe features using the latest Astro 6 Beta APIs and Tailwind 4.

## 1. Directory Structure

All feature-based modules should live in `src/modules/`:

```bash
src/modules/
└── [feature-name]/
    ├── components/
    ├── layouts/
    └── pages/
```

## 2. Content Layer Configuration

Astro 6 relies on the Content Layer. Always define typesafe schemas in `src/content/config.ts`.

```typescript
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
  [feature-name]: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/data/[feature-name]" }),
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
    })
  }),
};
```

## 3. Dynamic Logic & Backend (Actions)

For form handling or dynamic data, use the Astro Actions API.

```typescript
// src/actions/index.ts
import { defineAction, z } from 'astro:actions';

export const server = {
  [feature-action]: defineAction({
    input: z.object({ id: z.string() }),
    handler: async (input) => {
      // Logic here
      return { success: true };
    }
  })
};
```

## 4. Standard Layout

Each module should have a dedicated layout that imports the project's global Tailwind 4 stylesheet.

```astro
---
import '../../styles/global.css';
import { ClientRouter } from 'astro:transitions';
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <ClientRouter />
  <title>{title}</title>
</head>
<body class="bg-white dark:bg-neutral-950 font-sans">
  <slot />
</body>
</html>
```

## 4. Workflow Integration

When generating a module, always:

1. Initialize the `data/` folder with a sample entry.
2. Run `astro check` to verify types.
3. Use `use context7` to fetch the latest 2026 syntax for Server Islands or Actions if needed.
