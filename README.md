# RAF CHESS SUPERCOMPUTER

A chess-training workspace for player development and coaching.

## Current prototype

- Dashboard with player rating baseline and target.
- Interactive chessboard powered by `chess.js`.
- Legal move validation, move history, undo, board flip, reset, and PGN import.
- Student directory stored in the current browser using localStorage.
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

## Current limitations

This is the first frontend prototype. Student records are stored only in the browser that created them. There is no authentication, cloud database, Stockfish engine, automatic game evaluation, or verified tactical puzzle service yet. The opening/opponent/tactics/performance areas are module foundations, not completed analysis systems.

## Planned architecture

1. Authentication and persistent database for player and coach/student profiles.
2. PGN game library and structured game annotations.
3. Stockfish WebAssembly integration for real engine-backed analysis.
4. Opening repertoire tree and opponent database.
5. Training plans, performance metrics, and progress reports.
6. Secure deployment with access controls.
