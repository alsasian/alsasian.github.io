# CLAUDE.md - AI-Assisted Development Documentation

This document tracks the AI-assisted development of this project using Claude Code CLI and Claude.ai.

## Project Overview

**alsasian.github.io** is a personal website and WebCrypto playground built with Astro, React, and Tailwind CSS. The site features a minimalist newspaper-inspired design and provides interactive cryptographic tools for learning and experimentation.

## AI Assistance Approach

This project has been developed with significant AI assistance from Claude (Anthropic). The development follows these principles:

1. **AI as a collaborative tool**: Claude assists with architecture, implementation, and optimization
2. **Human oversight**: All changes are reviewed and approved before deployment
3. **Transparency**: This document tracks major AI-contributed changes and decisions
4. **Quality standards**: AI-generated code follows the same quality standards as human-written code

## Major Architectural Decisions

### 1. Design System Evolution (Completed)

**Decision**: Transition from flashy gradients to minimalist newspaper theme

- **Reasoning**: Better readability, more professional appearance, timeless aesthetic
- **Implementation**: Complete CSS overhaul with serif typography, clean borders, monochrome palette
- **AI Contribution**: Full design system implementation

### 2. WebCrypto Playground Refactoring (Completed)

**Decision**: Modularize 921-line monolithic component into focused, reusable components

- **Original**: Single `WebCryptoPlayground.tsx` with 921 lines
- **Refactored**: 11 focused components with clear responsibilities
  - Core: `WebCryptoPlayground.tsx` (124 lines) - orchestration only
  - Sections: `EncryptSection.tsx`, `DecryptSection.tsx`, `HashSection.tsx`, etc.
  - Utilities: `CryptoUtils.ts`, `types.ts`, `constants.ts`
- **Benefits**:
  - Improved maintainability and testability
  - Better code organization and separation of concerns
  - Easier to add new cryptographic operations
- **AI Contribution**: Full refactoring architecture and implementation

### 3. Content Infrastructure (Completed)

**Decision**: Use Astro Content Collections for blog posts

- **Implementation**:
  - Type-safe blog post schema with Zod validation
  - Markdown-based content authoring
  - Automatic routing with `[...slug].astro`
  - Clean URL structure
- **AI Contribution**: Full blog infrastructure setup

### 4. Code Quality Tooling (Completed)

**Decision**: Implement comprehensive code quality automation

- **Tools**:
  - Prettier (formatting)
  - ESLint v9 with flat config (linting)
  - Husky + lint-staged (pre-commit hooks)
  - EditorConfig (editor consistency)
  - VS Code settings (IDE integration)
- **Migration**: Successfully migrated from ESLint v8 (.eslintrc.cjs) to v9 (eslint.config.js)
- **AI Contribution**: Full tooling setup and configuration

### 5. SEO and Social Sharing (Completed)

**Decision**: Implement comprehensive metadata for SEO and social platforms

- **Implementation**:
  - Open Graph tags (Facebook, LinkedIn, Discord)
  - Twitter Cards with large image support
  - Canonical URLs for SEO
  - Article-specific metadata for blog posts
  - Custom OG image generation workflow
- **AI Contribution**: Full SEO infrastructure and OG image tooling

## File Structure

```
alsasian.github.io/
├── src/
│   ├── components/
│   │   └── crypto/              # WebCrypto Playground components
│   │       ├── WebCryptoPlayground.tsx
│   │       ├── EncryptSection.tsx
│   │       ├── DecryptSection.tsx
│   │       ├── HashSection.tsx
│   │       ├── SignSection.tsx
│   │       ├── VerifySection.tsx
│   │       ├── GenerateKeySection.tsx
│   │       ├── DeriveKeySection.tsx
│   │       ├── WrapKeySection.tsx
│   │       ├── CryptoUtils.ts
│   │       ├── types.ts
│   │       └── constants.ts
│   ├── layouts/
│   │   └── Layout.astro          # Main layout with SEO metadata
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   └── blog/
│   │       ├── index.astro       # Blog listing
│   │       └── [...slug].astro   # Blog post template
│   ├── content/
│   │   ├── config.ts             # Content collections schema
│   │   └── blog/                 # Blog posts (markdown)
│   └── styles/
│       └── global.css            # Newspaper theme styles
├── public/
│   ├── og-image.svg              # OG image source (SVG)
│   └── og-image.png              # Generated OG image (PNG)
├── scripts/
│   ├── og-image-generator.html   # Browser-based OG image tool
│   └── generate-og-image.js      # Node.js OG image generator
├── .husky/
│   └── pre-commit                # Git pre-commit hook
├── .vscode/
│   ├── settings.json             # VS Code settings
│   └── extensions.json           # Recommended extensions
├── .prettierrc                   # Prettier config
├── .prettierignore               # Prettier ignore patterns
├── eslint.config.js              # ESLint v9 flat config
├── .editorconfig                 # Editor consistency config
├── astro.config.mjs              # Astro configuration
├── tailwind.config.mjs           # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies and scripts
```

## AI-Generated vs Human-Modified Code

### Fully AI-Generated (Minimal to No Human Modification)

- All files in `src/components/crypto/` (WebCrypto Playground)
- All files in `src/content/config.ts` (content collections)
- All configuration files (.prettierrc, eslint.config.js, .editorconfig, etc.)
- `scripts/generate-og-image.js` (OG image generator)
- `scripts/og-image-generator.html` (browser OG image tool)
- `src/layouts/Layout.astro` (SEO metadata implementation)
- `.husky/pre-commit` (git hooks)
- `.vscode/settings.json` (IDE configuration)

### Human-Authored Content

- Blog post content in `src/content/blog/` (written by human)
- Design decisions and requirements (human-directed)
- Project goals and feature requests (human-initiated)

### Collaborative (AI Implementation, Human Direction)

- Overall site architecture and design
- Feature prioritization and roadmap
- UX decisions and improvements

## Development Workflow

### Code Quality Automation

Every commit automatically runs:

1. ESLint with auto-fix for code quality
2. Prettier for consistent formatting
3. Pre-commit hooks via Husky and lint-staged

### Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run format       # Format all files with Prettier
npm run format:check # Check formatting without making changes
npm run lint         # Lint all files with ESLint
npm run lint:fix     # Lint and auto-fix issues

# OG Image Generation
node scripts/generate-og-image.js  # Generate og-image.png from SVG
# OR open scripts/og-image-generator.html in browser
```

## Recent Changes

### File Organization (2025-01-08)

- Moved OG image generation tools from root to `scripts/` directory
- Updated all path references in `generate-og-image.js`
- Created this CLAUDE.md documentation file

### SEO and Social Metadata (2025-01-08)

- Added comprehensive Open Graph tags to Layout.astro
- Implemented Twitter Card support with large image
- Added canonical URLs for SEO best practices
- Created custom OG image (1200x630) matching site design
- Set up multiple OG image generation methods

### Code Quality Tooling (2025-01-08)

- Migrated from ESLint v8 to v9 (flat config)
- Set up Prettier with Astro and Tailwind plugins
- Configured Husky pre-commit hooks with lint-staged
- Added VS Code workspace settings
- Created .editorconfig for cross-editor consistency

### WebCrypto Playground Refactoring (2025-01-07)

- Broke down 921-line monolith into 11 focused components
- Extracted shared utilities (CryptoUtils.ts)
- Created TypeScript types (types.ts)
- Centralized constants (constants.ts)
- Improved code organization and maintainability

### Design System Overhaul (2025-01-06)

- Transitioned from gradient-heavy design to newspaper theme
- Implemented serif typography (Georgia for headings)
- Created minimalist monochrome color palette
- Added clean borders and spacing system

## Known Issues and Future Work

### Potential Enhancements

- [ ] Add RSS feed for blog posts
- [ ] Implement structured data (JSON-LD) for better SEO
- [ ] Create additional favicon sizes (16x16, 32x32, etc.)
- [ ] Add dark mode support
- [ ] Implement blog post search functionality
- [ ] Add code syntax highlighting for blog posts
- [ ] Create more WebCrypto operations (random generation, etc.)

### Technical Debt

- None currently identified

## Contact and Maintenance

This project is maintained by alsasian with AI assistance from Claude (Anthropic).

**Repository**: https://github.com/alsasian/alsasian.github.io
**Live Site**: https://alsasian.github.io

---

_This document is maintained to provide transparency about AI-assisted development practices and to help future contributors (human or AI) understand the project's evolution._
