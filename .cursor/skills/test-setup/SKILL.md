---
name: test-setup
description: Creates and initializes a Playwright test environment—project structure, dependencies, and shared configuration. Use when the user asks for a playwright test environment to be created, to set up Playwright tests, create agent-config, playwright.config, global setup, Allure reporting, Playwright browser code coverage (v8-to-istanbul, Istanbul output), Azure DevOps–compatible Cobertura (cobertura-coverage.xml), or to initialize a new test automation project.
---

# Test Setup (Playwright)

**Use this skill when the user asks for a Playwright test environment to be created** (or to set up/initialize Playwright tests).

## Role

You are a DevOps and Test Architect.

## Required: ask the user first

**Do not create any files until you have asked the user and received answers** (or they explicitly say "use defaults" or "defaults"). Cursor skills cannot pause for input automatically—you must ask in your reply and wait for the user’s response before proceeding.

Ask in one message:
1. **Where should the Playwright project root folder be?** (e.g. `./e2e`, `./playwright-tests`) — **all** config and test files (package.json, playwright.config.ts, agent-config.json, tests, etc.) will be created **inside** this folder so test automation stays separate from application code. Default is `./e2e` if they say "defaults".
2. **Within that root, where should the test folder be?** (e.g. `./E2E`, `./tests`) — default is `./E2E` if they say "defaults".
3. **Within that root, where should the feature folder be?** (e.g. `./features`) — default is `./features` if they say "defaults".
4. **What is the base URL of the app under test?** (e.g. `https://localhost:3000`, `https://example.com`) — required for `agent-config.json`.

Only after the user replies (or says "use defaults" for 1–3 and provides or skips 4) should you create files.

## Task

When initializing a Playwright test automation project, perform these steps in order:

### 1. Ask for project root, folder locations, and baseUrl

- **You MUST ask the user** (see "Required: ask the user first" above). Do not assume defaults unless the user has already said "use defaults" or "defaults".
- Use their answers as `projectRoot`, `testDir`, `featureDir`, and `baseUrl`. If they said "defaults" for folders, use `projectRoot = ./e2e`, `testDir = ./E2E`, `featureDir = ./features`. For `baseUrl`, if they did not provide one, use a placeholder like `https://example.com` and tell them to edit `agent-config.json` later.
- **All files must be created inside `projectRoot`** so test code and config are separate from application code. Paths: `{projectRoot}/package.json`, `{projectRoot}/playwright.config.ts`, `{projectRoot}/agent-config.json`, `{projectRoot}/tsconfig.json`, `{projectRoot}/.gitignore`, `{projectRoot}/README.md`, `{projectRoot}/docs/`, `{projectRoot}/{testDir}/`, `{projectRoot}/{featureDir}/`. Use these values in all following steps.

### 2. Create `package.json` inside project root

- Create **`{projectRoot}/package.json`** (e.g. `./e2e/package.json`). Do not create package.json at the workspace root when the user has a project root—everything goes inside `projectRoot`.

Include these dependencies:

- `playwright`
- `@playwright/test`
- `@axe-core/playwright` (or `@axe-core/webdriverjs` if not using Playwright)
- `allure-commandline`
- `allure-playwright`
- `v8-to-istanbul` (for converting Playwright browser coverage to Istanbul format)
- `istanbul-lib-coverage`, `istanbul-lib-report`, `istanbul-reports` (for Istanbul → Cobertura XML for Azure DevOps)
- `@types/node`
- `typescript`

Include these scripts (paths relative to project root):

- `test` — run Playwright tests (e.g. `playwright test`)
- `test:coverage` — run Chromium tests then generate Cobertura (e.g. `playwright test --project=chromium && npm run coverage:cobertura`)
- `coverage:cobertura` — convert `coverage/playwright-istanbul.json` to `coverage/cobertura-coverage.xml` (e.g. `node scripts/istanbul-to-cobertura.cjs`)
- `test:headed`, `test:ui`, `report` (Allure) as needed

### 3. Create `agent-config.json` inside project root

- Create **`{projectRoot}/agent-config.json`**.
- Use the `baseUrl` from step 1 (you already asked for it; do not create this file until you have it or the user said "defaults").
- Set `testDir` and `featureDir` to paths **relative to project root** (e.g. `"./E2E"`, `"./features"`). These are the same values from step 1 (testDir/featureDir are already relative to where the config lives).
- This file is the shared configuration used by Playwright config.

### 4. Create `playwright.config.ts` inside project root

- Create **`{projectRoot}/playwright.config.ts`**. Resolve `agent-config.json` from the same directory (e.g. `join(__dirname, 'agent-config.json')`).
- Configure it to **load `baseUrl` from `agent-config.json`** (read the JSON at config load time and assign to `use.baseURL` or equivalent).
- Use **ES6 modules** (e.g. ensure `module` is ESNext/NodeNext in tsconfig if needed, and use `import`/`export`).
- Configure **Allure reporting** (e.g. `reporter: [['list'], ['allure-playwright', ...]]` or equivalent for your Allure setup).
- Set **globalSetup** to `'{testDir}/setup/global.setup.ts'` (e.g. `./E2E/setup/global.setup.ts` when testDir is `./E2E`). Path is relative to project root.

### 5. Create `.gitignore` inside project root

- Create **`{projectRoot}/.gitignore`** (not at workspace root). It should exclude:
  - `node_modules/`
  - Test results: `test-results/`, `playwright-report/`, `blob-report/`, `allure-results/`, `.playwright/`
  - Code coverage: `coverage/`

### 6. Directory structure inside project root

- Create directories **inside `projectRoot`**: `{projectRoot}/{testDir}`, `{projectRoot}/{featureDir}`, and `{projectRoot}/scripts` (e.g. `./e2e/E2E`, `./e2e/features`, `./e2e/scripts`).
- Ensure `{projectRoot}/{testDir}/setup` exists for global setup (e.g. `./e2e/E2E/setup`).
- Do not create test or feature folders at the workspace root; they live under `projectRoot`.

### 7. Global setup (pre-run hook)

- In `playwright.config.ts`, set `globalSetup` to `'{testDir}/setup/global.setup.ts'`.
- Global setup runs once before all tests (e.g. for storage state or login).
- **Create `{projectRoot}/{testDir}/setup/global.setup.ts` only if missing** (e.g. `./e2e/E2E/setup/global.setup.ts`). Do not overwrite existing content. If it exists, treat it as a user-defined placeholder for pre-run code.

### 8. Install dependencies

- **Change directory to `projectRoot`** (e.g. `cd ./e2e`), then run `npm install` and `npx playwright install`. All install and playwright commands run from inside the project root so node_modules and Playwright browsers are scoped to the test project.

### 9. Verify setup

- Ensure all created files are valid (e.g. valid JSON, valid TypeScript).
- Confirm `playwright.config.ts` correctly reads `baseUrl` from `agent-config.json`.

### 10. Example test

- Create a sample test file at **`{projectRoot}/{testDir}/example.spec.ts`** (e.g. `./e2e/E2E/example.spec.ts`) that uses the `baseUrl` from config (e.g. via `page.goto('/')` or `baseURL` from Playwright’s `use`).
- **The example test MUST include code coverage**: Import `startCoverage` and `stopCoverage` from the coverage helper using the **explicit `.js` extension** (e.g. `from './setup/coverage.js'`). In each test: call `startCoverage(page)` before navigation, run the test, then `stopCoverage(page)` after. **Guard coverage with Chromium only** (e.g. `if (test.info().project.name === 'chromium')`) so Firefox/WebKit still pass—Playwright’s coverage API is Chromium-only.
- For any spec that imports from the coverage helper, always use the `.js` extension in the import path so it works with Node16/NodeNext module resolution.

### 11. Playwright code coverage (browser + Istanbul + Cobertura)

- **Coverage model**: Use Playwright’s **built-in browser coverage** (Chromium only). Do **not** use c8 for E2E—c8 only covers Node/test-runner code, not the app under test.
- **Coverage helper**: Create **`{projectRoot}/{testDir}/setup/coverage.ts`** that:
  - Exposes `startCoverage(page)` and `stopCoverage(page)`, uses `page.coverage.startJSCoverage()`/`startCSSCoverage()` and `stopJSCoverage()`/`stopCSSCoverage()`.
  - Converts V8 JS to Istanbul with **v8-to-istanbul** (use `createRequire(import.meta.url)` to `require('v8-to-istanbul')` in ESM).
  - **When Playwright provides `entry.source`** (script content), pass it to v8-to-istanbul as the third argument: `v8ToIstanbul(scriptPath, 0, { source: entry.source })` so that **remote URLs** (e.g. `https://` app under test) are converted to Istanbul without reading from disk. For `file://` URLs, use the path; for remote URLs use a stable path-like key (e.g. derive from `entry.url` like `hostname + pathname` with `path.sep` for separators) so Cobertura has sensible file paths.
  - Writes raw V8 to `coverage/playwright-js-*.json`, `coverage/playwright-css-*.json`, and Istanbul to `coverage/playwright-istanbul.json`. Coverage output directory is relative to where tests run (project root), so `coverage/` resolves to `{projectRoot}/coverage/`.
- **Istanbul → Cobertura (Azure DevOps)**: Create **`{projectRoot}/scripts/istanbul-to-cobertura.cjs`** (CommonJS) that: reads `coverage/playwright-istanbul.json`; uses `istanbul-lib-coverage.createCoverageMap(raw)`, `istanbul-lib-report.createContext({ dir: coverageDir, coverageMap, sourceFinder })` (sourceFinder returns `''` for `http://`, `https://`, `file://` and otherwise tries `fs.readFileSync`), and `istanbul-reports.create('cobertura', { file: 'cobertura-coverage.xml' }).execute(context)`; writes to `coverage/cobertura-coverage.xml`. Exit 0 with a warning if `playwright-istanbul.json` is missing.
- **Outputs**: Raw V8 in `coverage/playwright-js-*.json`, `coverage/playwright-css-*.json`; Istanbul in `coverage/playwright-istanbul.json`; **Cobertura in `coverage/cobertura-coverage.xml`** (generated by `npm run coverage:cobertura` or as part of `npm run test:coverage`).
- **Docs**: Add **`{projectRoot}/docs/code-coverage-azure-devops.md`** describing how coverage is collected, that the helper uses `entry.source` for remote URLs, where files are written, the `test:coverage` and `coverage:cobertura` scripts, and how to publish `cobertura-coverage.xml` in Azure Pipelines (PublishCodeCoverageResults@2).

### 12. Create README inside project root

- Create **`{projectRoot}/README.md`** (e.g. `./e2e/README.md`) that explains the Playwright environment. Do not create README at the workspace root for the Playwright setup. Include:
  - **Overview**: What this project is (Playwright test automation) and that config is driven by `agent-config.json`.
  - **Prerequisites**: Node.js (suggest a minimum version, e.g. 18+).
  - **Installation**: `npm install` and `npx playwright install`.
  - **Configuration**: Describe `agent-config.json` (`baseUrl`, `testDir`, `featureDir`) and that `playwright.config.ts` reads from it. Mention where to change the base URL.
  - **Project structure**: Brief description of `testDir`, `featureDir`, `{testDir}/setup` (global setup), and where tests live.
  - **Running tests**: Commands (e.g. `npm test`, `npx playwright test`, `npx playwright test --ui`, `npx playwright test --headed`). How to generate/view Allure reports if applicable.
  - **Global setup**: What `{testDir}/setup/global.setup.ts` is for (e.g. one-time pre-run logic like login or storage state) and that they can edit it.
  - **Code coverage**: Browser coverage (Chromium only) via Playwright’s coverage API; V8 → Istanbul via `v8-to-istanbul` (using `entry.source` when available for remote URLs); outputs in `coverage/` including `playwright-istanbul.json`. **Cobertura**: run `npm run coverage:cobertura` after tests to generate `coverage/cobertura-coverage.xml` for Azure DevOps, or `npm run test:coverage` to run Chromium tests and generate Cobertura in one step. Point to `docs/code-coverage-azure-devops.md`.
- Use the actual `projectRoot`, `testDir`, `featureDir`, and paths used in this project so the README matches what was created. Note that users run `npm test` and `npx playwright test` from **inside the project root folder** (e.g. `cd e2e` then `npm test`).

## Rules

- **Create all Playwright-related files inside `projectRoot`.** Do not create package.json, playwright.config.ts, agent-config.json, tsconfig.json, .gitignore, README, or test/feature directories at the workspace root when a project root is specified—this keeps test automation separate from application code.
- **Do not overwrite existing files without checking.** If a file exists, read it first and only change it when the user asks or when the task explicitly allows (e.g. global setup is “create only if missing”).
- **Ensure JSON is valid** in `agent-config.json` and `package.json` (no trailing commas, correct quoting).
- **ESM import extensions**: When `tsconfig.json` uses `"moduleResolution": "node16"` or `"nodenext"`, relative imports in TypeScript **must** use the runtime file extension (`.js` for compiled `.ts` files). For example, use `from './setup/coverage.js'` not `from './setup/coverage'`. This avoids "Relative import paths need explicit file extensions" errors.

## Summary checklist

- [ ] Asked user for **project root folder** (e.g. `./e2e`), then test dir and feature dir within it, and baseUrl; use those paths throughout
- [ ] **All files created inside `projectRoot`**: `package.json`, `agent-config.json`, `playwright.config.ts`, `tsconfig.json`, `.gitignore`, `README.md`, `docs/`, `{testDir}/`, `{featureDir}/`, `scripts/`
- [ ] `{projectRoot}/package.json` with required deps (including `v8-to-istanbul`, `istanbul-lib-coverage`, `istanbul-lib-report`, `istanbul-reports`) and scripts `test`, `test:coverage`, `coverage:cobertura`
- [ ] `{projectRoot}/agent-config.json` with `baseUrl` (from user), `testDir`, `featureDir` (paths relative to project root)
- [ ] `{projectRoot}/playwright.config.ts` loads `baseUrl` from `agent-config.json`, ES6 modules, Allure, globalSetup pointing to `{testDir}/setup/global.setup.ts`
- [ ] `{projectRoot}/.gitignore` with `node_modules/`, test result dirs, and `coverage/`
- [ ] Directories: `{projectRoot}/{testDir}`, `{projectRoot}/{featureDir}`, `{projectRoot}/{testDir}/setup`, `{projectRoot}/scripts`
- [ ] `{projectRoot}/{testDir}/setup/global.setup.ts` and `coverage.ts` created (global setup only if missing); coverage.ts uses `entry.source` when available for v8-to-istanbul so remote URLs produce Istanbul
- [ ] `{projectRoot}/scripts/istanbul-to-cobertura.cjs` created: reads `playwright-istanbul.json`, writes `coverage/cobertura-coverage.xml` via istanbul-lib-coverage/report/reports
- [ ] `npm install` and `npx playwright install` run **from `projectRoot`**
- [ ] Example test at `{projectRoot}/{testDir}/example.spec.ts` using `baseUrl` **and code coverage** (import `startCoverage`/`stopCoverage` from `./setup/coverage.js`, call before/after test, Chromium-only guard)
- [ ] Playwright code coverage: browser + v8-to-istanbul (with entry.source for remote URLs) in `{testDir}/setup/coverage.ts`; Istanbul → Cobertura in `scripts/istanbul-to-cobertura.cjs`; `{projectRoot}/docs/code-coverage-azure-devops.md` with Cobertura and Azure DevOps steps
- [ ] `{projectRoot}/README.md` created explaining the Playwright environment (overview, config, structure, run from project root, global setup, code coverage, test:coverage / coverage:cobertura for Cobertura)
