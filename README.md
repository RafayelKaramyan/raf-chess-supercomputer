# RAF CHESS SUPERCOMPUTER

**Private source repository:** https://github.com/RafayelKaramyan/raf-chess-supercomputer

A chess-training workspace for player development and coaching, built with React, TypeScript, Vite, and chess.js.

## Current prototype

- Dashboard with OTB rating baseline (1794) and target (2200).
- Interactive chessboard with legal move validation.
- Move history, board flip, reset, undo, and PGN import/export.
- Save, reopen, and delete PGN games in the current browser.
- Student directory stored in the current browser.
- Opening, opponent-preparation, tactics, and performance module foundations.
- Responsive dark interface.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deploy as a website

The repository includes `vercel.json`. Import this private GitHub repository into a Vercel project and deploy with the detected Vite settings. The deployment will create a public or access-restricted website depending on the Vercel project settings. Do not assume the website is live until the deployment succeeds.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the steps.

## Data and current limitations

This is an early frontend prototype. Student records and saved games are stored in browser localStorage on the device/browser where they were created. They are not synced across devices and are not backed up to a cloud database.

There is currently no user authentication, cloud database, Stockfish engine, automatic game evaluation, or verified tactical puzzle service. The opening/opponent/tactics/performance areas are foundations for future modules, not completed analysis systems.

## Roadmap

1. Add cloud authentication and database-backed player and coach/student profiles.
2. Build a searchable PGN library with annotations and game tagging.
3. Integrate Stockfish WebAssembly and report real engine-backed evaluations.
4. Build an opening repertoire tree and opponent preparation database.
5. Add structured training plans, performance metrics, and progress reports.
6. Add role-based access and privacy controls for student records.
