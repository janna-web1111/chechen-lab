# Chechen Lab Agent Guide

## Project Purpose

Chechen Lab is an MVP web application for learning Chechen from A0 to A1.

The MVP goal is to check whether a user wants to continue learning after the first 10 minutes.

## Source of Truth

Use the numbered specs in `Spek/` as the main source of truth.

Read first:

1. `Spek/09-спецификация-mvp.md`
2. `Spek/16-план-разработки-mvp.md`
3. `Spek/17-решения-перед-разработкой-mvp.md`
4. `Spek/18-контент-mvp-5-тем.md`
5. `Spek/19-план-и-roadmap-первой-разработки.md`

Functional specs live in:

`Spek/Функции/`

## MVP Scope

Build only the MVP:

- online web app;
- Russian interface;
- A0 -> A1 path;
- 5 first topics;
- short lessons;
- cards;
- quiz after a topic;
- local progress;
- simple review.

Do not add before MVP validation:

- backend;
- login or accounts;
- parent dashboard;
- payments;
- PWA;
- native mobile app;
- offline mode;
- audio;
- streaks;
- complex analytics;
- advanced AI;
- levels above A1;
- full admin panel.

## AI Skills and Instructions

Project-specific instructions live in:

`agents/Skills/`

Use them in this order:

1. `agents/Skills/01-chechen-mvp-guardian/`
2. `agents/Skills/02-chechen-content-builder/`
3. `agents/Skills/03-chechen-webapp-builder/`
4. `agents/Skills/04-chechen-qa-release-checker/`
5. `agents/Skills/05-chechen-mvp-feedback-analyst/`
6. `agents/Skills/06-specification-driven-development/`

## App Structure

The Next.js app lives in:

`app-next/`

Current stack:

- Next.js;
- TypeScript;
- App Router;
- Tailwind CSS;
- static content data;
- `localStorage` progress.

The older static prototype lives in:

`app/`

Treat it as a prototype/reference unless the project decides to remove it.

## Content Rules

Chechen learning content must not be treated as final unless it has been checked by a native speaker or responsible reviewer.

Use these statuses:

- `needs_native_review`;
- `reviewed`;
- `published`.

Do not present AI-generated Chechen words, pronunciation, reading hints, or grammar as verified facts.

## Development Checks

For `app-next/`, run:

```bash
npm run lint
npm run build
```

Then manually check:

`start -> topics -> first topic -> cards -> quiz -> result -> saved progress -> review`

## Git Hygiene

Keep specs, app code, and AI configuration changes understandable in commits.

Before sharing the GitHub link, make sure:

- working tree is clean;
- latest changes are committed;
- latest changes are pushed to GitHub;
- GitHub `main` contains the required specs and AI configuration.
