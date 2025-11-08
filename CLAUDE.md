# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and WebCrypto playground built with **Astro**, **React**, **TypeScript**, and **Tailwind CSS**. Features a minimalist newspaper-inspired design and interactive cryptographic tools.

## Development Commands

```bash
# Development
npm run dev          # Start dev server at localhost:4321
npm run build        # Build for production (runs astro check first)
npm run preview      # Preview production build

# Code Quality (enforced via Husky pre-commit hooks)
npm run format       # Format with Prettier
npm run format:check # Check formatting
npm run lint         # Lint with ESLint v9
npm run lint:fix     # Lint and auto-fix

# OG Image Generation
node scripts/generate-og-image.js  # Generate og-image.png from SVG
```

## Architecture

### WebCrypto Playground Component Structure

The WebCrypto playground (refactored from a 921-line monolith) uses a modular architecture:

- **Core**: `src/components/crypto/WebCryptoPlayground.tsx` - orchestration component
- **Operation sections**: `EncryptSection.tsx`, `DecryptSection.tsx`, `HashSection.tsx`, `SignSection.tsx`, `VerifySection.tsx`, `GenerateKeySection.tsx`, `DeriveKeySection.tsx`, `WrapKeySection.tsx`
- **Shared utilities**: `CryptoUtils.ts`, `types.ts`, `constants.ts`

### Content Collections

Blog posts use Astro Content Collections with:

- Type-safe schema with Zod validation in `src/content/config.ts`
- Markdown files in `src/content/blog/`
- Dynamic routing via `src/pages/blog/[...slug].astro`

### Layout & SEO

- Main layout: `src/layouts/Layout.astro` includes comprehensive SEO metadata (Open Graph, Twitter Cards, canonical URLs)
- Design system: Newspaper theme in `src/styles/global.css` with serif typography and monochrome palette

## Tooling

- **ESLint v9**: Flat config in `eslint.config.js` (migrated from v8)
- **Prettier**: Configured with Astro and Tailwind plugins
- **Pre-commit hooks**: Husky + lint-staged auto-formats and lints on commit
