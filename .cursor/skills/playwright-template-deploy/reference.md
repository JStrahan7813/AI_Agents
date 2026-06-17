# Playwright template reference

Source repository: [Playwright_automation_template](https://dev.azure.com/texthelp-ltd/Test_Automation/_git/Playwright_automation_template)

## Clone URLs

| Method | URL |
|--------|-----|
| HTTPS | `https://dev.azure.com/texthelp-ltd/Test_Automation/_git/Playwright_automation_template` |
| SSH | `git@ssh.dev.azure.com:v3/texthelp-ltd/Test_Automation/Playwright_automation_template` |

Default branch: `master`

## Directory map

| Path | Role |
|------|------|
| `tests/` | Specs; copy `tests/singleTests/example_*.test.ts` as starters |
| `common/` | `testConfig.ts`, `selector.ts`, helpers, AI runtime (`aiFunctions`) |
| `fixture/` | Coverage fixture: `fixture/coverage.ts` when a spec imports that `test` |
| `playwright.config.ts` | Browser projects, reporters, timeouts |
| `config/` | JSON for the `config` package; env overrides in `common/testConfig.ts` |
| `feature/` | Optional Gherkin examples |
| `scripts/` | `coverage.ts`, `patchAllureStyles`, `aiSelectorGenerator.ts`, `postInstall.ts` |
| `report/` | `testResults/`, `coverage/`, `allure/` |

## Config model

Unlike **test-setup** (`agent-config.json`), this template uses:

- `config/default.json` (and other profiles under `config/`)
- `.env` for secrets and overrides
- `common/testConfig.ts` merges JSON with `process.env` (e.g. `TEST_PAGE`, `N2Y_LOGIN_PAGE`, `ENABLE_AI_CHECKS`)

## Default `.env` after deploy

Copy `.env.example` to `.env` and apply:

- `TEST_ACCESSIBILITY=true` (from `.env.example`)
- `ENABLE_AI_CHECKS=false` when `GPT_KEY` is empty (default at deploy time)

The skill **never prompts for `GPT_KEY`** (sensitive).  Every completion summary **must** include the mandatory **Action required: update `.env`** section: open `{subfolder}/.env`, examine it, add `GPT_KEY`, then set `ENABLE_AI_CHECKS=true`.

## npm scripts (from template package.json)

### Test presets

| Script | Browser |
|--------|---------|
| `npm run test:chrome-testing-beta` | CfT in `.browsers/` (recommended) |
| `npm run test:chrome` | Google Chrome (Playwright channel) |
| `npm run test:chrome-beta` | Chrome Beta (Playwright channel) |
| `npm run test:chromium` | Bundled Chromium (minimal path) |

Each preset sets `CHANNEL` via `cross-env` and uses `--workers=1`.

### Browser install

| Script | Purpose |
|--------|---------|
| `npm run install:chrome-testing-beta` | CfT beta into `.browsers/` |
| `npm run install:browsers` | Chrome, Chromium, Chrome-beta + CfT beta |
| `npm run install:chrome` | Google Chrome |
| `npm run install:chrome-beta` | Chrome Beta |
| `npm run install:chromium` | Bundled Chromium |

### Other

| Script | Purpose |
|--------|---------|
| `npm run typecheck` | `tsc --noEmit` |
| `npm run coverage` | Convert raw coverage to Istanbul + Cobertura |
| `npm run allure` | Generate and patch Allure HTML report |
| `npm run ai-selector` | AI selector generator (requires `GPT_KEY`) |

## Windows npm argument workaround

On PowerShell, extra arguments after `npm run … --` may not reach Playwright.  Use:

```bash
cmd /c "npm run test:chrome-testing-beta -- --list"
```

## Deploy smoke test

Run **one spec only** after deploy (default subfolder `./e2e`):

```bash
npm run test:chrome-testing-beta -- tests/singleTests/example_everway_homepage_language_selector_options.test.ts
```

Windows PowerShell:

```bash
cmd /c "npm run test:chrome-testing-beta -- tests/singleTests/example_everway_homepage_language_selector_options.test.ts"
```

Do not use the full suite for deploy verification.

## Verification results

Verified on Windows (Node 22, PowerShell) against `Playwright_automation_template` `master`, deployed to `./e2e`:

| Step | Result |
|------|--------|
| `git clone` into `./e2e` | Pass |
| Remove `.git`, `npm install` | Pass |
| `.env` with `TEST_ACCESSIBILITY=true`, `ENABLE_AI_CHECKS=false` (no `GPT_KEY`) | Pass |
| `npm run install:chrome-testing-beta` | Pass |
| `npm run typecheck` | Pass |
| `cmd /c "npm run test:chrome-testing-beta -- --list"` | Pass (4 tests listed) |
| Smoke: `example_everway_homepage_language_selector_options.test.ts` | Pass |

With `ENABLE_AI_CHECKS=false`, in-test AI helpers are off.  `TEST_ACCESSIBILITY=true` may still trigger `aiFeatureFile` in `beforeAll` (template behaviour), so console 401 is possible until `GPT_KEY` is added.  Smoke test still passes.  User adds `GPT_KEY` and sets `ENABLE_AI_CHECKS=true` after deploy for full AI features.

### Other bundled example tests (not run during deploy)

| File | Notes |
|------|-------|
| `example_everway_homepage_language_selector_options.test.ts` | **Deploy smoke test**; passes without credentials |
| `example_n2y_login_types.test.ts` | Login smoke + JS coverage |
| `example_everway_homepage_cookie_consent_allure.test.ts` | Needs `GPT_KEY` or pre-existing `.feature` under `feature/` |
| `example_n2y_signin_my_information_content.test.ts` | Needs `N2Y_USERNAME` / `N2Y_PASSWORD` |

## test-setup vs playwright-template-deploy

| | test-setup | playwright-template-deploy |
|--|------------|----------------------------|
| Source | Generated from skill | Cloned from ADO template |
| Config | `agent-config.json` | `config/` + `.env` + `testConfig.ts` |
| Test folder | `./E2E` (default) | `tests/` |
| Browser | Chromium + coverage helper | CfT beta recommended |
| Best for | Lightweight/custom scaffold | Standard Everway QA stack |
