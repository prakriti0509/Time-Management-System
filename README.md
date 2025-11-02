# Time-Management-System

A Next.js (App Router) TypeScript project for a time management/dashboard UI.

This README explains how to install, run, build, and deploy the project locally.

## Prerequisites
- Node.js 18+ (recommended). Check with:
  ```powershell
  node --version
  npm --version
  ```
- (Optional) pnpm for faster installs: `npm install -g pnpm`

## Install
From the project root (`C:\Users\Prakhar Srivastava\Desktop\Time-Management-System-main`):

Using pnpm (recommended if you have it):
```powershell
pnpm install
```

Or using npm:
```powershell
npm install
```

## Run in development
Start the Next.js dev server (hot reload):
```powershell
npm run dev
# or with pnpm
pnpm run dev
```
Open http://localhost:3000 in your browser.

If you need a different port in PowerShell:
```powershell
$env:PORT = 4000
npm run dev
```

## Build & Run (production)
Create an optimized production build and run it locally:
```powershell
npm run build
npm start
# or with pnpm
pnpm run build
pnpm start
```

## Linting & TypeScript
- The project uses TypeScript. `tsconfig.json` is included.
- To run linting (if set up):
```powershell
npm run lint
```

## Environment variables
No project-specific environment variables are specified in the repo. If you add any `.env` keys, don't commit them — `.gitignore` already excludes `.env` files.

## Deploying
- Recommended: Vercel. Import the repo on Vercel and it will detect Next.js automatically.
- Other hosts: build with `npm run build` and serve the result on a Node host.

## Troubleshooting
- "next: command not found" — ensure dependencies were installed and you're in the project root.
- Build errors (Tailwind/PostCSS): verify Node version and installed packages.

## Useful commands summary (PowerShell)
```powershell
# install
npm install

# dev
npm run dev

# build + start
npm run build
npm start
```

## License & Contribution
This repo doesn't include a license file. Add one if you plan to share it publicly.
