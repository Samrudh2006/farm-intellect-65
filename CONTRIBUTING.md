# Contributing to Krishi AI — Farm Intellect

Thank you for your interest in contributing to **Krishi AI**! 🌾 This project aims to empower Indian farmers with AI-driven tools in their own language.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
- Git

### Local Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/farm-intellect-65.git
cd farm-intellect-65

# 2. Install dependencies
npm install

# 3. Create .env from .env.example
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID

# 4. Start development server
npm run dev
```

## 📋 How to Contribute

### Reporting Bugs
- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include browser, OS, and steps to reproduce
- Screenshots are very helpful!

### Suggesting Features
- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Explain the use case, especially for Indian farming context

### Code Contributions

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make changes** following our code style
4. **Test** your changes:
   ```bash
   npm run test
   npm run lint
   ```
5. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add crop rotation optimizer for Punjab region"
   ```
6. **Push** and open a **Pull Request**

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no code change |
| `refactor:` | Code restructuring |
| `test:` | Adding tests |
| `chore:` | Build, CI, dependencies |

## 🎨 Code Style

- **TypeScript** — Strict mode, no `any` types
- **React** — Functional components with hooks
- **Tailwind CSS** — Use semantic design tokens from `index.css`, never raw colors
- **Components** — Small, focused, reusable
- **Naming** — PascalCase for components, camelCase for functions/variables
- **Imports** — Use `@/` path aliases

## 🌍 Localization

We support **22 Indian languages**. When adding user-facing strings:
1. Add the English string to `src/i18n/translations.ts`
2. Add translations for at least Hindi and Punjabi
3. Use `const { t } = useLanguage()` in components

## 🗄️ Database Changes

- All schema changes must go through migration files
- Always add Row-Level Security (RLS) policies
- Never reference `auth.users` directly — use `profiles` table
- Roles are in `user_roles` table, never on `profiles`

## 🔒 Security

- Never hardcode API keys or secrets
- Use environment variables for sensitive data
- All tables must have RLS policies
- See [SECURITY.md](SECURITY.md) for vulnerability reporting

## 📦 Pull Request Guidelines

- Fill out the PR template completely
- Link related issues
- Include screenshots for UI changes
- Ensure CI passes (lint + tests)
- Keep PRs focused — one feature/fix per PR

## 🤝 Code of Conduct

By participating, you agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

## 💬 Questions?

Open a [Discussion](https://github.com/YOUR_USERNAME/farm-intellect-65/discussions) or reach out in Issues.

---

<p align="center">
  <strong>Every contribution helps Indian farmers. Thank you! 🇮🇳🌾</strong>
</p>
