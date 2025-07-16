# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

description: Use Bun instead of Node.js, npm, pnpm, or vite.
globs: "_.ts, _.tsx, _.html, _.css, _.js, _.jsx, package.json"
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
  fsMap?: Record<string, string> // File system mapping for code
  entrypoint?: string // Entry point file
  code?: string // Direct code input (alternative to fsMap)
  height?: string | number // Iframe height
  showRunButton?: boolean // Show run button in iframe
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
- Semicolons: only where needed
- Filename convention: kebab-case with export support
- File naming enforced by Biome rules

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.md`.
