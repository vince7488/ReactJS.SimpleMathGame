# Simple Math Game

A React-based children's math game where players select one or more numbers that add up to the displayed number of stars. Use every number before the countdown expires to win.

The purpose of this application is to serve as a compact demonstration of my knowledge of React state management, component composition, event handling, effects, and conditional rendering.

## Current Stack

- React 19 with TypeScript
- Vite for development and production builds
- Less for styling
- ESLint and Prettier for code quality and formatting
- Vitest and React Testing Library for automated tests

## Updates

- (2026 JUN)
  - Modernization: This project was converted from JavaScript to React with TypeScript. Its legacy Webpack, Babel, and Express development setup was replaced with Vite. ESLint, Prettier, Vitest, and React Testing Library were added to support ongoing development.
  - Refactored App, game, and math files into modern, reusable React components.
  - Improved Accessibility with better colours, keyboard controls, and improved the UI styling.
  - Improved security by adding a github pull request CI.
  - Upgraded Node version to 24+.
  - Adding new features:
    - Added a "Ready to Start?" button so that the player has time to focus on the game.
    - Added a "Difficulty Level choice" - adds a few more seconds to the timer if you picked Easy, or normal, compared to the earlier version where it always starts at 10 seconds.

## Requirements

- Node.js 24.16.0 LTS or newer
- npm

Confirm the active runtime before installing dependencies:

```sh
node --version
npm --version
```

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

## Controls

- Select numbers by clicking, tapping, or pressing keys `1` through `9`.
- Clear the current selection with the Clear button or `Escape`.
- Start another round with the Play Again button or `R`.

Author: [Vernard Mercader](https://vernard.net)
