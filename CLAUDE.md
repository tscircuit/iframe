# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---
description: Use Bun instead of Node.js, npm, pnpm, or vite.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

## Project Overview

This is a React TypeScript library that provides a `TscircuitIframe` component for embedding tscircuit code execution in an iframe. The component communicates with the remote tscircuit runframe service to execute circuit designs and display interactive previews.

## Development Commands

- `bun install` - Install dependencies
- `bun run start` - Start the development server using React Cosmos
- `bun run build` - Build the library for distribution (outputs to `dist/`)
- `bun run build:site` - Build the documentation site using Cosmos export
- `bun run vercel-build` - Build for Vercel deployment (alias for build:site)
- `biome check` - Run linting and formatting checks
- `biome check --write` - Auto-fix linting and formatting issues

## Architecture

### Core Component Structure

- **`lib/TscircuitIframe.tsx`** - Main component that renders an iframe pointing to `https://runframe.tscircuit.com/iframe.html`
- **`pages/`** - Contains React Cosmos fixture pages (`.page.tsx` files) for component development and testing
- **`dist/`** - Built library output directory
- **`cosmos-export/`** - Generated static site for online playground

### Component Communication

The `TscircuitIframe` component uses postMessage API to communicate with the remote runframe:

1. Iframe loads and sends `runframe_ready_to_receive` message
2. Component responds with `runframe_props_changed` message containing props
3. Component handles various callback events (onRenderFinished, onError, etc.)

### Key Props Interface

```typescript
interface TscircuitIframeProps {
  fsMap?: Record<string, string>  // File system mapping for code
  entrypoint?: string             // Entry point file
  code?: string                   // Direct code input (alternative to fsMap)
  height?: string | number        // Iframe height
  showRunButton?: boolean         // Show run button in iframe
  // Various callback functions for events
}
```

## Development Tools

- **React Cosmos** - Component development environment (configured via `cosmos.config.json`)
- **Biome** - Code formatting and linting (configured via `biome.json`)
- **TypeScript** - Type checking (configured via `tsconfig.json`)
- **tsup** - Library bundling for distribution

## Code Style

- Uses Biome for formatting with space indentation
- JSX quotes: double quotes
- Trailing commas: always
- Semicolons: as needed
- Filename convention: kebab-case with export support
- File naming enforced by Biome rules

## Testing

Use `bun test` to run tests (no test files currently exist in the project).

```ts
import { test, expect } from "bun:test";

test("example test", () => {
  expect(1).toBe(1);
});
```

## Bun Configuration

Default to using Bun instead of Node.js:

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx
import React from "react";

// import .css files directly and it works
import './index.css';

import { createRoot } from "react-dom/client";

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.