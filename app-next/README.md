# Chechen Lab App

`app-next/` is the main Next.js web app for the Chechen Lab MVP.

## MVP Scope

Build only the first online web MVP:

- Russian interface;
- A0 -> A1 learning path;
- 5 first topics;
- cards;
- quiz after a topic;
- local progress;
- simple review.

Do not add backend, accounts, payments, PWA, native mobile app, offline mode, audio, streaks, advanced analytics, advanced AI, or levels above A1 before MVP validation.

## Project Structure

- `src/app/` - Next.js App Router entry points.
- `src/components/` - UI components and the main learning flow.
- `src/data/` - static learning content and UI constants.
- `src/lib/` - content, quiz, and progress helpers.
- `src/types/` - TypeScript types for content and progress.

Learning content must stay separate from UI code. Progress is stored only in `localStorage` for the MVP.

## Content Status

Chechen words, reading hints, pronunciation, and grammar are not final unless checked by a native speaker or responsible reviewer.

Use:

- `needs_native_review`;
- `reviewed`;
- `published`.

## Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Checks

Run before finishing app work:

```bash
npm run lint
npm run build
```

Then manually check:

```text
start -> topics -> first topic -> cards -> quiz -> result -> saved progress -> review
```
