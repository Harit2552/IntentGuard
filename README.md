# IntentGuard

IntentGuard is an AI-powered blockchain transaction management and security platform. This repository contains the initial development foundation only; application-specific features are intentionally out of scope.

## Technology stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, TypeScript
- Blockchain: Solidity, Hardhat, Ethers.js
- Shared tooling: npm workspaces, ESLint, Prettier, dotenv, Git

## Project structure

```text
apps/
  frontend/       React application
  backend/        Express API
blockchain/       Hardhat and Solidity workspace
packages/
  shared/         Shared TypeScript types and utilities
```

## Prerequisites

- Node.js 22.12 or newer (Vite 8 requirement)
- npm 10 or newer
- Git

## Installation

From the repository root, install all workspace dependencies:

```sh
npm run install:all
```

Create a local environment file from the example. In PowerShell:

```powershell
Copy-Item .env.example .env
```

The example contains placeholders only. Do not put secrets in frontend environment variables or commit a local `.env` file.

## Development commands

Run the frontend and backend together:

```sh
npm run dev
```

Run either application independently:

```sh
npm run dev:frontend
npm run dev:backend
```

Build the applications:

```sh
npm run build:frontend
npm run build:backend
```

Run blockchain development commands:

```sh
npm run blockchain:compile
npm run blockchain:test
npm run blockchain:node
```

Code quality commands:

```sh
npm run lint
npm run format:check
```

The backend listens on `http://localhost:5000` by default. Its health endpoint is `GET /api/health`.

## Initialization status

The workspaces, TypeScript configurations, frontend foundation, backend health endpoint, shared package, and local Hardhat compiler setup are initialized.

The frontend now includes the Stage 1–6 product shell and mock workflows for authentication, wallet context, AI intent drafts, policies, simulation, risk, execution review, batches, audit, and security monitoring. These are integration-ready UI and mock-service implementations, not real authentication, signing, broadcasting, or on-chain confirmation.
