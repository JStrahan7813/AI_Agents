# Test Setup (Playwright Environment)

Use this reference when the user asks for a **Playwright test environment to be created** (or to set up/initialize Playwright tests). It covers project structure, dependencies, shared configuration, global setup, Allure reporting, and Chrome for Testing Beta (installed via @puppeteer/browsers).

## Role

You are a DevOps and Test Architect.

## Required: ask the user first

**Do not create any files until you have asked the user and received answers** (or they explicitly say "use defaults" or "defaults"). Cursor skills cannot pause for input automatically—you must ask in your reply and wait for the user's response before proceeding.

Ask in one message:
1. **Where should the test project root folder be created?** (e.g. `./e2e-playwright`, `./playwright-tests`) — All project files (config, scripts, modules, and tests) will go inside this folder so the test suite is isolated from the rest of the repo. The actual test files will live in a **`tests`** subfolder (e.g. `./e2e-playwright/tests`). Default is `./playwright` if they say "defaults".
2. **What is the base URL of the app under test?** (e.g. `https://localhost:3000`, `https://example.com`) — required for `agent-config.json`.

Only after the user replies (or says "use defaults" for 1 and provides or skips 2) should you create files.

## Task

When initializing a Playwright test automation project, perform these steps in order:

### 1. Ask for project root and baseUrl

- **You MUST ask the user** (see "Required: ask the user first" above). Do not assume defaults unless the user has already said "use defaults" or "defaults".
- **Project root**: The user's answer is the **test project root** (`projectRoot`). All created files (package.json, configs, scripts, tests, features, README) go inside this folder so the test suite is isolated from the rest of the repo. If they said "defaults", use `./playwright`.
- **Derived paths** (all relative to workspace; paths inside config files under projectRoot are relative to projectRoot):
  - `testDir` = `{projectRoot}/tests` (e.g. `./playwright/tests`) — where spec files live. In `agent-config.json` and `playwright.config.ts` (which live in projectRoot), use `"./tests"`.
  - `featureDir` = `{projectRoot}/features` (e.g. `./playwright/features`). In config use `"./features"`.
- **baseUrl**: If they did not provide one, use a placeholder like `https://example.com` and tell them to edit `agent-config.json` later. **Normalize baseUrl** to a full URL (e.g. add `https://` if the user gives a bare hostname like `www.example.com`).
- Use `projectRoot`, `testDir`, `featureDir`, and `baseUrl` in all following steps. **Create every file and directory under `projectRoot`** (e.g. `{projectRoot}/package.json`, `{projectRoot}/tests/setup/...`).

### 2. Create `{projectRoot}/package.json`

- Create **package.json inside the project root** so the test project is self-contained.
- If using ESM (recommended for consistent config paths), set `"type": "module"`.
- Include these dependencies (use current major versions; check npm—e.g. **@puppeteer/browsers** is ^2.x, not 0.x):
  - `playwright`
  - `@playwright/test`
  - `@puppeteer/browsers` (for Chrome for Testing Beta; see [Puppeteer browsers API](https://pptr.dev/browsers-api); use ^2.0.0 or later)
  - `@axe-core/webdriverjs`
  - `allure-commandline`
  - `allure-playwright`
  - `assert`
  - `@types/node`
  - `typescript`
  - **Code coverage** (browser JS/CSS → Istanbul → Cobertura for CI): `v8-to-istanbul`, `istanbul-lib-coverage`, `istanbul-lib-report`, `istanbul-reports`

### 3. Create `{projectRoot}/agent-config.json`

- Create **agent-config.json inside the project root**.
- Use the `baseUrl` from step 1 (you already asked for it; do not create this file until you have it or the user said "defaults").
- Set `testDir` to `"./tests"` and `featureDir` to `"./features"` (paths relative to projectRoot).
- This file is the shared configuration used by Playwright config.

### 4. Create `{projectRoot}/playwright.config.ts`

- Create **playwright.config.ts inside the project root**. All paths in it are relative to projectRoot (the config file's directory).
- Configure it to **load `baseUrl` from `agent-config.json`** (in the same directory) at config load time and assign to `use.baseURL`. **Load JSON synchronously** (e.g. `fs.readFileSync` + `JSON.parse`) so the config stays synchronous and works regardless of how Playwright loads it; avoid top-level await in the config.
- Use **ES6 modules** or CommonJS as appropriate (e.g. `module` ESNext/NodeNext in tsconfig). If the project uses ESM (`"type": "module"` in package.json), do **not** use `__dirname` (it is undefined in ESM); use `const __dirname = path.dirname(fileURLToPath(import.meta.url))` after importing `path` and `fileURLToPath` from `'url'`.
- Set **testDir** from agent-config (e.g. `'./tests'`) so tests live under projectRoot/tests.
- Configure **Allure reporting** (e.g. `reporter: [['list'], ['allure-playwright', ...]]` or equivalent).
- Set **globalSetup** to `'./tests/setup/global.setup.ts'` and resolve it relative to the config file (e.g. `path.join(__dirname, 'tests', 'setup', 'global.setup.ts')`) so it works when run from projectRoot. For more on global setup, see [global-setup.md](global-setup.md).
- **Chrome for Testing Beta**: Add a conditional project for Chrome for Testing Beta (not consumer Chrome Beta). Resolve the executable from (1) env `PLAYWRIGHT_CHROME_FOR_TESTING_BETA_PATH`, or (2) `browsers/cft-beta-manifest.json` (written by the install script under projectRoot). **Read the manifest synchronously** (e.g. `fs.existsSync` + `fs.readFileSync` + `JSON.parse`) so the config remains synchronous. If a path is available, add a project (e.g. `name: 'chrome-for-testing-beta'`) with `use: { ...devices['Desktop Chrome'], channel: undefined, executablePath: <resolved path> }`. If neither env nor manifest exists, omit the project so the config still works.
- **Default run**: Include at least one standard project (e.g. `chromium` with `devices['Desktop Chrome']`) so that `npm test` / `npx playwright test` runs tests by default without requiring `--project`.

### 5. Directory structure (all under projectRoot)

- Create **projectRoot** if it does not exist.
- Under projectRoot: ensure `tests/` and `features/` exist (actual specs in `tests/`, feature files in `features/`).
- Ensure `{projectRoot}/tests/setup` exists for global setup.
- Ensure `{projectRoot}/scripts/` exists (for the Chrome for Testing Beta install script).
- Optionally add a `.gitkeep` (or similar) in empty directories (e.g. `features/`) so they are tracked by git before any real files are added.

### 6. Chrome for Testing Beta (install via Puppeteer browsers API)

- Install Chrome for Testing **Beta** using **[@puppeteer/browsers](https://pptr.dev/browsers-api)** (not a custom fetch of the Chrome for Testing JSON). This uses the same automation-focused Beta builds and keeps the implementation simple and maintained.
- **Create `{projectRoot}/scripts/install-chrome-for-testing-beta.js`** (only if missing; do not overwrite if it exists). The script must use the `@puppeteer/browsers` API:
  - Determine **project root** as the directory containing package.json (e.g. `path.resolve(__dirname, '..')` when the script lives in `scripts/`). All paths below are relative to this root.
  - Call **`detectBrowserPlatform()`** to get the current platform (e.g. `win64`, `linux64`, `mac-arm64`, `mac-x64`). If it returns `undefined`, exit with an error (unsupported platform).
  - Resolve the Beta build ID with **`resolveBuildId(browser, platform, tag)`** using `Browser.CHROME`, the detected platform, and **`BrowserTag.BETA`** as the tag (see [browsers API](https://pptr.dev/browsers-api)—use `BrowserTag.BETA`, not `ChromeReleaseChannel.BETA` for this call).
  - **`install(options)`** with `browser`, the resolved `buildId`, `platform`, and a project-local `cacheDir` (e.g. `path.join(projectRoot, 'browsers')`). This downloads and unpacks the Chrome for Testing Beta binary.
  - Get the executable path with **`computeExecutablePath(options)`** for the same `browser`, `buildId`, `platform`, and `cacheDir`.
  - Write **`{projectRoot}/browsers/cft-beta-manifest.json`** with `{ "executablePath": "<absolute path from computeExecutablePath>", "version": "<buildId>" }` so `playwright.config.ts` can read it.
  - Write **`{projectRoot}/browsers/cft-beta-audit.json`** (a separate audit/provenance file) recording the source of the Chrome for Testing Beta binary. Include: `channel` (e.g. `"beta"`), `platform` (e.g. `"win64"`), `buildId` or `version` (same as manifest), `downloadHost` (`"https://storage.googleapis.com/chrome-for-testing-public"`), `buildIdSource` (`"https://googlechromelabs.github.io/chrome-for-testing"`), `installer` (`"@puppeteer/browsers"`), `installedAt` (ISO timestamp). Optionally include `installScript` (e.g. `"scripts/install-chrome-for-testing-beta.js"`). This gives a clear record of which package was downloaded and from where.
- Add **npm scripts** in `{projectRoot}/package.json`: `"install:cft-beta": "node scripts/install-chrome-for-testing-beta.js"`. Optionally add `"test:verify": "playwright test --project=chromium && playwright test --project=chrome-for-testing-beta"`. **Note:** if the chrome-for-testing-beta project is not configured (manifest/env missing), the second part will **fail** with an unknown project error; document in the README that `test:verify` is for use when CfT Beta is installed.
- Add **`browsers/`** to `{projectRoot}/.gitignore` (create `.gitignore` under projectRoot if missing) so downloaded CfT binaries are not committed.

### 7. Code coverage (browser JS/CSS → Istanbul → Cobertura)

- **Purpose**: Collect JS/CSS coverage from the browser (Playwright Coverage API, Chromium), convert to Istanbul format, and optionally to Cobertura XML for CI (e.g. Azure DevOps `PublishCodeCoverageResults@2`). See [test-coverage.md](test-coverage.md) for patterns.
- **Add npm script** in `{projectRoot}/package.json`: `"coverage:cobertura": "node scripts/istanbul-to-cobertura.cjs"`. Run after tests to produce `coverage/cobertura-coverage.xml` from `coverage/playwright-istanbul.json`.
- **Add `coverage/`** to `{projectRoot}/.gitignore` (create or update .gitignore under projectRoot) so coverage output is not committed.
- **Create `{projectRoot}/scripts/playwright-coverage.cjs`** (only if missing). The script must:
  - Export **`savePlaywrightCoverage(jsCoverage, cssCoverage, options)`** as an **async** function (returns `Promise<void>`); callers must **await** it. Parameters: `jsCoverage` / `cssCoverage` from `page.coverage.stopJSCoverage()` / `stopCSSCoverage()`, and `options`: `runId` (string), optional `coverageDir` (default `coverage/`), optional `testInfo` (for attaching artifacts).
  - Create `coverage/` if needed; write raw V8 JS to `playwright-js-{runId}.json`, raw CSS to `playwright-css-{runId}.json`.
  - Convert JS coverage to Istanbul using **v8-to-istanbul**. For each entry: create converter with `v8toIstanbul(entry.url, 0, { source: entry.source })`; then **must call `await script.load()`** before `script.applyCoverage(entry.functions)` and `script.toIstanbul()` — v8-to-istanbul requires `load()` to populate internal state or the Istanbul output will be empty. Merge all entries into one object and write **`coverage/playwright-istanbul.json`** (overwritten each run; for CI run `coverage:cobertura` right after tests).
  - If `testInfo` is provided, attach the JS, CSS, and Istanbul files as test artifacts.
- **Create `{projectRoot}/scripts/istanbul-to-cobertura.cjs`** (only if missing). The script must:
  - Read **`coverage/playwright-istanbul.json`** (Istanbul format). If the file does not exist, log a warning and exit 0.
  - Use **istanbul-lib-coverage**, **istanbul-lib-report**, and **istanbul-reports** to produce **`coverage/cobertura-coverage.xml`** (Cobertura format). Use a **sourceFinder** that returns empty string for `http://`, `https://`, or `file://` URLs so browser script URLs are not read from disk.
  - Log success and exit 0.
- **Usage in tests**: In a spec (e.g. under `{projectRoot}/tests/`), require the helper with `createRequire(import.meta.url)` if the project is ESM, then in the test: `await page.coverage.startJSCoverage({ resetOnNavigation: true });` and `startCSSCoverage(...)` before navigation; after actions call `stopJSCoverage()` and `stopCSSCoverage()`; then **`await savePlaywrightCoverage(jsCoverage, cssCoverage, { runId: test.info().project.name + '-' + Date.now(), testInfo: test.info() })`** (the helper is async). Coverage is supported in **Chromium** only; run coverage-collecting tests with the Chromium project.
- **Example test must include coverage**: The created example test (step 11) must collect and save coverage as above so verification can run it and coverage output is produced by default. Do not make coverage optional in the example.

### 8. Global setup (pre-run hook)

- In `playwright.config.ts`, set `globalSetup` to `'./tests/setup/global.setup.ts'` (relative to projectRoot).
- Global setup runs once before all tests (e.g. for storage state or login). See [global-setup.md](global-setup.md) for patterns.
- **Create `{projectRoot}/tests/setup/global.setup.ts` only if missing.** Do not overwrite existing content. If it exists, treat it as a user-defined placeholder for pre-run code.

### 9. Install dependencies

- **Change directory to projectRoot** (e.g. `cd ./playwright` or `cd ./e2e-playwright`), then run from there:
  - `npm install`
  - `npx playwright install` to install Playwright browsers
  - **`npm run install:cft-beta`** to install Chrome for Testing Beta via Puppeteer's browsers API (so the `chrome-for-testing-beta` project is available). If the script fails (e.g. network or platform), document in the README that users can run it later or set `PLAYWRIGHT_CHROME_FOR_TESTING_BETA_PATH` to a custom path.
- Document in the README that all test commands must be run from the **project root** (the folder containing package.json and playwright.config.ts).

### 10. Verify setup

- Ensure all created files are valid (e.g. valid JSON, valid TypeScript) and live under projectRoot.
- From **projectRoot**, confirm `playwright.config.ts` correctly reads `baseUrl` from `agent-config.json`.
- **List projects**: From projectRoot, run `npx playwright test --list`. If CfT Beta was installed, the `chrome-for-testing-beta` project must appear; if the manifest/env is not set, that project must be omitted.
- **Verify tests run by default**: From projectRoot, run at least one test (e.g. `npx playwright test --project=chromium` or a single-worker run) so that "tests run by default" is confirmed. Fix config or example test if the run fails.
- **Verify tests run on Chrome for Testing Beta**: When CfT Beta was installed, from projectRoot run at least one test with `npx playwright test --project=chrome-for-testing-beta`. This confirms the CfT Beta executable and manifest are correct. If this run fails, document in the README that users can set `PLAYWRIGHT_CHROME_FOR_TESTING_BETA_PATH` or re-run `npm run install:cft-beta`.

### 11. Example test

- Create a sample test file in **`{projectRoot}/tests/`** (e.g. `example.spec.ts`) that uses the `baseUrl` from config (e.g. via `page.goto('/')` or `baseURL` from Playwright's `use`).
- Keep the example **minimal and robust** so verification (step 10) does not flake: e.g. `page.goto('/')` then a loose assertion like `await expect(page).toHaveTitle(/.+/)` so it passes for any valid page. Avoid assertions that depend on specific copy or DOM unless the base URL is a known stable fixture.
- **Include code coverage** in the example test so that future setups produce coverage by default:
  - At the top of the spec, use **`createRequire(import.meta.url)`** to require the CJS helper (e.g. `require('../scripts/playwright-coverage.cjs')` — path relative to the spec under `tests/`).
  - In the test, accept **`testInfo`** as the second argument to the test callback. Only start/stop coverage when the project supports it: e.g. `testInfo.project.name === 'chromium' || testInfo.project.name === 'chrome-for-testing-beta'` (Coverage API is Chromium-only).
  - **Before** navigation: call `page.coverage.startJSCoverage({ resetOnNavigation: true })` and `page.coverage.startCSSCoverage({ resetOnNavigation: true })`.
  - **After** the main assertion: call `Promise.all([ page.coverage.stopJSCoverage(), page.coverage.stopCSSCoverage() ])`, then **`await savePlaywrightCoverage(jsCoverage, cssCoverage, { runId: testInfo.project.name + '-' + Date.now(), testInfo })`** (the helper is async). This writes raw and Istanbul coverage and attaches artifacts when `testInfo` is passed.

### 12. Create README

- Create **`{projectRoot}/README.md`** that explains the Playwright environment that was created. Include:
  - **Overview**: This folder is a self-contained Playwright test project (config, scripts, and tests live here so it can be dropped into an existing repo). Config is driven by `agent-config.json`.
  - **Prerequisites**: Node.js (suggest a minimum version, e.g. 18+).
  - **Installation**: From this folder (the project root): `npm install`, `npx playwright install`, and optionally `npm run install:cft-beta` for Chrome for Testing Beta.
  - **Configuration**: Describe `agent-config.json` (`baseUrl`, `testDir` = `./tests`, `featureDir` = `./features`) and that `playwright.config.ts` reads from it. Mention where to change the base URL.
  - **Project structure**: All paths relative to this folder: `tests/` (spec files), `tests/setup/` (global setup), `features/`, `scripts/` (CfT Beta install, coverage scripts), `coverage/` (coverage output, gitignored), `browsers/` (CfT binaries, gitignored).
  - **Running tests**: From this folder: `npm test`, `npx playwright test`, `npx playwright test --ui`, `npx playwright test --headed`. Note that by default all projects run. How to run a specific project (e.g. `--project=chrome-for-testing-beta`). How to generate/view Allure reports if applicable.
  - **Code coverage**: Browser JS/CSS coverage is collected via Playwright's Coverage API (Chromium). Use `scripts/playwright-coverage.cjs` in tests (start/stop JSCoverage and CSSCoverage, then call `savePlaywrightCoverage`); output is written to `coverage/playwright-istanbul.json`. Run `npm run coverage:cobertura` after tests to generate `coverage/cobertura-coverage.xml` for CI (e.g. Azure DevOps). See [test-coverage.md](test-coverage.md).
  - **Verification** (optional): From this folder run `npx playwright test --project=chromium` and `npx playwright test --project=chrome-for-testing-beta` (when CfT Beta is installed) to confirm both work.
  - **Chrome for Testing Beta**: Explain that the project includes a **Chrome for Testing Beta** browser (installed via [@puppeteer/browsers](https://pptr.dev/browsers-api), the automation-focused Beta build from Chrome for Testing, not the consumer "Chrome Beta" app). Document: (1) run `npm run install:cft-beta` to install and configure it; (2) run tests with `npx playwright test --project=chrome-for-testing-beta`; (3) the config uses `browsers/cft-beta-manifest.json` or `PLAYWRIGHT_CHROME_FOR_TESTING_BETA_PATH`; (4) `browsers/cft-beta-audit.json` records the source of the binary for audit/provenance.
  - **Global setup**: What `tests/setup/global.setup.ts` is for (e.g. one-time pre-run logic like login or storage state) and that they can edit it.
- Use the actual projectRoot name and paths so the README matches what was created.

## Rules

- **Do not overwrite existing files without checking.** If a file exists, read it first and only change it when the user asks or when the task explicitly allows (e.g. global setup is "create only if missing").
- **Ensure JSON is valid** in `agent-config.json` and `package.json` (no trailing commas, correct quoting).

## Summary checklist

- [ ] Asked user for **test project root** folder (everything inside it; tests in `tests/` subfolder); use projectRoot throughout
- [ ] `{projectRoot}/package.json` with required deps (including coverage: `v8-to-istanbul`, `istanbul-lib-coverage`, `istanbul-lib-report`, `istanbul-reports`), script `install:cft-beta` (and optionally `test:verify`), and script `coverage:cobertura`
- [ ] `{projectRoot}/agent-config.json` with `baseUrl` (from user), `testDir` = `"./tests"`, `featureDir` = `"./features"` (from user's choices)
- [ ] `{projectRoot}/playwright.config.ts` loads `baseUrl` and CfT manifest **synchronously**, testDir `./tests`, includes Allure, globalSetup, ESM-safe paths, and conditional Chrome for Testing Beta project; at least one default project (e.g. chromium) so tests run by default
- [ ] Under projectRoot: directories `tests/`, `features/`, `tests/setup/`, `scripts/` (optionally .gitkeep in empty dirs)
- [ ] `{projectRoot}/scripts/install-chrome-for-testing-beta.js` created (only if missing) using `@puppeteer/browsers`; writes `{projectRoot}/browsers/cft-beta-manifest.json` and `cft-beta-audit.json` with source/provenance
- [ ] **Code coverage**: `{projectRoot}/scripts/playwright-coverage.cjs` created (only if missing) with **async** `savePlaywrightCoverage` that calls **`await script.load()`** before `applyCoverage`/`toIstanbul()` for each entry (required by v8-to-istanbul); write `coverage/playwright-istanbul.json`; `{projectRoot}/scripts/istanbul-to-cobertura.cjs` created (only if missing) for Cobertura XML; `coverage/` in `{projectRoot}/.gitignore`
- [ ] `browsers/` in `{projectRoot}/.gitignore`
- [ ] `{projectRoot}/tests/setup/global.setup.ts` created only if missing
- [ ] From projectRoot: `npm install`, `npx playwright install`, and `npm run install:cft-beta` run (document CfT Beta install if script fails)
- [ ] Example test in `{projectRoot}/tests/` using `baseUrl`, minimal and robust for verification, **and including code coverage** (start/stop JSCoverage/CSSCoverage on Chromium/CfT Beta only, then **`await savePlaywrightCoverage`** from `scripts/playwright-coverage.cjs` via `createRequire`; helper is async)
- [ ] **Verification**: From projectRoot, `npx playwright test --list`; run test on default project and (when CfT Beta installed) with `--project=chrome-for-testing-beta`
- [ ] `{projectRoot}/README.md` created explaining the Playwright environment (overview, config, structure, run from this folder, code coverage, Chrome for Testing Beta, global setup, optional verification)
