# Simple Math Game

A children's math game where players select one or more numbers that add up to
the displayed number of stars. Use every number before the countdown expires to
win.

## Current Stack

- React 19 with TypeScript
- Vite for development and production builds
- Less for styling
- ESLint and Prettier for code quality and formatting
- Vitest and React Testing Library for automated tests

## Modernization

This project was converted from JavaScript to React with TypeScript. Its legacy
Webpack, Babel, and Express development setup was replaced with Vite. ESLint,
Prettier, Vitest, and React Testing Library were added to support ongoing
development.

## Requirements

- Node.js 22
- npm

## Run Locally

Install dependencies:

```sh
npm install
```

Start the Vite development server:

```sh
npm run dev
```

Create and preview a production build:

```sh
npm run build
npm run preview
```

## Quality Checks

Run the automated tests:

```sh
npm test
npm run test:watch
```

Check linting and formatting:

```sh
npm run lint
npm run format:check
```

Apply automatic lint and formatting fixes:

```sh
npm run lint:fix
npm run format
```

## Game Rules

1. Select one or more numbers whose sum equals the number of displayed stars.
2. Each number can only be used once.
3. Use all nine numbers before the timer expires to win.

Author: [Vernard Mercader](http://vernard.net)
