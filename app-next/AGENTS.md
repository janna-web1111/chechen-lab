<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Chechen Lab Rules

- This app is the MVP web frontend for the Chechen learning project.
- Keep MVP scope: A0 -> A1, 5 topics, cards, quiz, local progress, review.
- Do not add backend, accounts, payments, PWA, native mobile, audio, streaks, advanced analytics, or levels above A1.
- Store learning content separately from UI code in `src/data/`.
- Store progress only in `localStorage` for MVP.
- Treat Chechen words, reading hints, and pronunciation as unverified unless `verificationStatus` is `reviewed` or `published`.
- Main specs live in `../Spek/`; functional specs live in `../Spek/Функции/`.
