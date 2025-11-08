# alsasian.github.io

Welcome to my GitHub Pages site!

## About

This is a personal website hosted on GitHub Pages.

## Setup

This repository is configured as a **User Pages site**, which means:

- The site is automatically published from the default branch (usually `main` or `master`)
- The site URL is: `https://alsasian.github.io`
- Content is served from the root directory

## How to Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/alsasian/alsasian.github.io`
2. Click on **Settings** (top right)
3. Scroll down to the **Pages** section (left sidebar)
4. Under **Source**, select the branch you want to publish (typically `main`)
5. Optionally select a folder (`/ (root)` or `/docs`)
6. Click **Save**

GitHub will automatically build and deploy your site within a few minutes.

## Customization

You can customize your site by:

- Editing `index.html` directly for a simple HTML site
- Adding CSS files for styling
- Adding JavaScript for interactivity
- Using a static site generator like Jekyll (built-in support on GitHub Pages)
- Adding custom domain (configure in Settings → Pages)

## Jekyll Support (Optional)

GitHub Pages has built-in support for Jekyll. To use Jekyll:

1. Add a `_config.yml` file
2. Use Jekyll themes and layouts
3. Write content in Markdown

Example `_config.yml`:
```yaml
title: Your Site Title
description: Your site description
theme: minima
```

## Local Development

To test your site locally:

```bash
# For simple HTML sites
python3 -m http.server 8000

# For Jekyll sites
gem install bundler jekyll
bundle exec jekyll serve
```

Then visit `http://localhost:8000` (or `http://localhost:4000` for Jekyll)

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Themes](https://pages.github.com/themes/)

## License

MIT
