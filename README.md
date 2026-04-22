# ALGORITHMIC_MONOLITH — Jekyll Blog

A high-fidelity Jekyll theme for security researchers, cryptographers, and computational infrastructure specialists. Designed for GitHub Pages deployment.

## Quick Start

### Prerequisites

- Ruby 3.1+
- Bundler: `gem install bundler`

### Local Development

```bash
bundle install
bundle exec jekyll serve --livereload
```

Visit `http://localhost:4000`

---

## GitHub Pages Deployment

### Option A — Push to `username.github.io` (user site)

1. Create a repo named **`username.github.io`** (replace with your GitHub username)
2. Push this directory to the `main` branch
3. In **Settings → Pages**, set source to **Deploy from branch → `main` → `/ (root)`**
4. Your site will be live at `https://username.github.io`

### Option B — Project site (any repo name)

1. Create any repo, e.g. `my-portfolio`
2. Push this directory to `main`
3. In **Settings → Pages**, set source to `main` branch, `/ (root)`
4. Site live at `https://username.github.io/my-portfolio/`
5. Update `baseurl: "/my-portfolio"` in `_config.yml`

---

## Customization

### 1. Site identity — `_config.yml`

```yaml
title: "YOUR_HANDLE"
tagline: "Your tagline here."
description: "Your bio sentence."

author:
  name: "Your Name"
  email: "you@example.com"
  github: "your-github-username"
  linkedin: "your-linkedin-slug"
```

### 2. Profile image

Replace `assets/images/portrait.jpg` with your own photo.
The image is automatically converted to greyscale via CSS.

### 3. Contact form

The contact page uses [Formspree](https://formspree.io) (free tier: 50 submissions/month).

1. Sign up at formspree.io
2. Create a form and copy your form ID
3. In `contact/index.html`, replace `YOUR_FORM_ID`:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```

Alternatively, replace with [Netlify Forms](https://docs.netlify.com/forms/setup/) or any other form backend.

### 4. Hero competency cards

Edit the three cards in `index.html` inside the `<!-- COMPETENCIES -->` section. Change titles, descriptions, and chip tags to match your actual skills.

### 5. Colors & fonts

All design tokens are in `_sass/_variables.scss`. Key values:

```scss
$primary:           #000000;   // Button / high-contrast
$primary-container: #101b30;   // Dark navy sections
$secondary:         #4a6fa5;   // Accent / links
$surface:           #f7f9fc;   // Page background
```

---

## Content

### Writing a research post

Create a file in `_posts/` with the format `YYYY-MM-DD-title.md`:

```markdown
---
layout: post
title: "Your Paper Title"
date: 2024-06-01
category: Volume_01
excerpt: "One sentence abstract shown in listings."
tags: [cryptography, statistics]
---

Your content here...
```

### Adding a project

Create a file in `_projects/` with any name, e.g. `my-tool.md`:

```markdown
---
layout: project
title: "Project Name"
description: "Short description for the card."
category: SYSTEMS
status: ACTIVE
tags: [rust, ethereum]
image: /assets/images/project-screenshot.jpg
---

Full project writeup...
```

---

## File Structure

```
algorithmic-monolith/
├── _config.yml          # Site configuration
├── _layouts/            # Page templates
│   ├── default.html
│   ├── home.html
│   ├── post.html
│   └── project.html
├── _includes/           # Reusable partials
│   ├── header.html
│   └── footer.html
├── _posts/              # Research posts (YYYY-MM-DD-title.md)
├── _projects/           # Project collection
├── _sass/               # Stylesheets
│   ├── _variables.scss
│   ├── _base.scss
│   ├── _header.scss
│   ├── _home.scss
│   └── _posts.scss
├── assets/
│   ├── css/main.scss    # SCSS entry point
│   ├── js/main.js
│   └── images/
├── index.html           # Homepage
├── research/index.html  # Post listing
├── projects/index.html  # Projects listing
├── contact/index.html   # Contact form
├── 404.html
└── Gemfile
```

---

## License

MIT — use freely for personal and commercial portfolios.
