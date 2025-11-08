# alsasian.github.io

Personal website and WebCrypto playground built with Astro, React, TypeScript, and Tailwind CSS.

## Features

- **Landing Page**: Beautiful gradient design with responsive layout
- **WebCrypto Playground**: Interactive tool for experimenting with Web Cryptography API
  - Hash generation (SHA-1, SHA-256, SHA-384, SHA-512)
  - AES-GCM encryption
  - ECDSA digital signatures
  - All operations run locally in the browser

## Tech Stack

- **Framework**: [Astro](https://astro.build) - Modern static site generator
- **UI Library**: [React](https://react.dev) - For interactive components
- **Language**: [TypeScript](https://www.typescriptlang.org) - Type-safe development
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **Deployment**: GitHub Pages with GitHub Actions

## Project Structure

```
/
├── public/              # Static assets
│   └── favicon.svg
├── src/
│   ├── components/      # React components
│   │   └── WebCryptoPlayground.tsx
│   ├── layouts/         # Astro layouts
│   │   └── Layout.astro
│   ├── pages/           # Pages (file-based routing)
│   │   ├── index.astro  # Landing page (/)
│   │   └── crypto.astro # WebCrypto playground (/crypto)
│   └── styles/          # Global styles
│       └── global.css
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Pages deployment
└── package.json
```

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/alsasian/alsasian.github.io.git
cd alsasian.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:4321`

### Available Commands

| Command            | Action                                       |
|:-------------------|:---------------------------------------------|
| `npm install`      | Install dependencies                         |
| `npm run dev`      | Start local dev server at `localhost:4321`   |
| `npm run build`    | Build production site to `./dist/`           |
| `npm run preview`  | Preview build locally before deploying       |
| `npm run astro`    | Run Astro CLI commands                       |

## Deployment to GitHub Pages

### Setup

1. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

3. **Automatic deployment**:
   - GitHub Actions will automatically build and deploy your site
   - The workflow is defined in `.github/workflows/deploy.yml`
   - Your site will be live at `https://alsasian.github.io`

### Workflow

The GitHub Actions workflow automatically:
1. Checks out the code
2. Sets up Node.js
3. Installs dependencies
4. Builds the Astro site
5. Deploys to GitHub Pages

Every push to the `main` branch triggers a new deployment.

## Customization

### Modify Pages

- **Landing page**: Edit `src/pages/index.astro`
- **Crypto playground**: Edit `src/components/WebCryptoPlayground.tsx`

### Change Styling

- **Global styles**: Edit `src/styles/global.css`
- **Tailwind config**: Edit `tailwind.config.mjs`
- **Layout colors**: Modify the gradient in `src/layouts/Layout.astro`

### Add New Pages

Create a new `.astro` file in `src/pages/`:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="My New Page">
  <main class="min-h-screen">
    <h1>Hello World</h1>
  </main>
</Layout>
```

The file will be automatically available at its path (e.g., `src/pages/about.astro` → `/about`)

### Add React Components

1. Create a new `.tsx` file in `src/components/`
2. Import it in an Astro page
3. Use the `client:load` directive for interactivity:

```astro
---
import MyComponent from '../components/MyComponent';
---

<MyComponent client:load />
```

## Resources

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Web Crypto API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## License

MIT
