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

## Git Workflow For Plans

Every concrete development plan must have its own Git branch.

Before starting a new plan:

1. Return to `main`.
2. Update `main` from GitHub.
3. Create a new branch for the plan.
4. Use a short branch name that describes the plan, for example `plan/content-review` or `feature/cards-flow`.

Do not start a new plan from an old feature branch.

While working on a plan:

- keep changes scoped to that plan;
- do not mix unrelated specs, app code, and cleanup unless the plan requires it;
- check `git status` before changing branches;
- do not overwrite user changes.

When the user asks to finish the plan:

1. Run the relevant checks.
2. Commit the completed work.
3. Push the branch to GitHub.
4. Create a pull request into `main`.
5. Share the PR link with the user.

After creating the pull request:

- do not merge the PR unless the user explicitly asks;
- the user will normally merge the PR on GitHub;
- before continuing with any new plan, return to `main`;
- update `main` from GitHub after the PR has been merged;
- only then create the next plan branch.

If the user asks to continue work after a PR, first verify:

```bash
git checkout main
git pull origin main
git status
```

Then create a new branch for the next plan.

## Git Hygiene

Keep specs, app code, and AI configuration changes understandable in commits.

Before sharing the GitHub link, make sure:

- working tree is clean;
- latest changes are committed;
- latest changes are pushed to GitHub;
- GitHub `main` contains the required specs and AI configuration.
