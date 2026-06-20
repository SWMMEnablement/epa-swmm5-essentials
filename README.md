# 🌊 EPA SWMM5 Essentials

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-96.3%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-Ready-000000?style=for-the-badge&logo=bun&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-App-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4?style=for-the-badge)
![SWMM](https://img.shields.io/badge/EPA-SWMM5-0ea5e9?style=for-the-badge)

**A modern web companion for exploring the essential concepts, workflows, and reference material behind EPA SWMM5.**

</div>

---

## 🚀 Overview

**EPA SWMM5 Essentials** is a focused web application in the SWMMEnablement organization, built with a modern TypeScript frontend and a Supabase-backed data layer.

The goal is simple: make core SWMM5 knowledge easier to browse, understand, and use through a cleaner, faster, and more approachable interface.

## ✨ Why this project exists

EPA’s Storm Water Management Model is used worldwide for planning, analysis, and design related to stormwater, sanitary sewer, and combined sewer systems. This repository creates a more accessible way to organize that essential knowledge for engineers, students, and practitioners.

Instead of scattering information across manuals, notes, and legacy references, this app can bring key SWMM5 concepts together in one place.

## 🧰 Tech stack

| Layer | Current setup |
|---|---|
| Language | TypeScript |
| Frontend tooling | Vite |
| Backend/data | Supabase |
| Runtime | Bun |
| Project workspace | Lovable-compatible structure |

## 📁 Repository structure

```text
epa-swmm5-essentials/
├── .lovable/        # Lovable project metadata and configuration
├── src/             # Main application source code
├── supabase/        # Backend or database-related configuration
├── .env             # Environment variables
├── bun.lock         # Bun lockfile
├── bunfig.toml      # Bun configuration
├── components.json  # UI/component configuration
├── eslint.config.js # Linting setup
├── package.json     # Scripts and dependencies
├── tsconfig.json    # TypeScript configuration
└── vite.config.ts   # Vite configuration
```

## 🌍 What SWMM5 covers

SWMM is used for dynamic simulation of runoff, hydraulics, and water quality in urban drainage systems. It supports stormwater networks, wastewater systems, and combined sewer systems, making it one of the core modeling engines in urban water infrastructure.

That makes an “essentials” app especially useful for:

- 🌧️ Learning SWMM5 fundamentals.
- 🏙️ Reviewing urban drainage concepts.
- 📘 Organizing reference content and examples.
- 🛠️ Supporting training, onboarding, and workshops.
- 🔎 Making key workflows easier to find and revisit.

## ⚡ Getting started

```bash
git clone https://github.com/SWMMEnablement/epa-swmm5-essentials.git
cd epa-swmm5-essentials
bun install
bun run dev
```

If the app depends on Supabase services, make sure the `.env` file is configured for your local environment before starting the development server.

## 🛣️ Direction ideas

- Build a searchable SWMM5 concept explorer.
- Add guided pages for hydrology, hydraulics, and water quality topics.
- Create curated “essential workflows” for common modeling tasks.
- Add examples, diagrams, and learning-friendly navigation.
- Connect structured knowledge to Supabase for filtering and retrieval.

## 🤝 Contributing

This repository appears to be under active development, with recent work in `src/`, `.env`, and README updates.

If collaboration expands, a useful next step would be to add:

- Clear setup instructions.
- Environment variable notes.
- A short feature roadmap.
- Screenshots of the interface.
- Contribution conventions for naming, structure, and review.

---

<div align="center">

**Essential SWMM knowledge deserves a modern interface.**

</div>
