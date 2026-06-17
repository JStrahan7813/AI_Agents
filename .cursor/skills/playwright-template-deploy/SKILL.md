---
name: playwright-template-deploy
description: Clones and deploys the official Everway Playwright_automation_template from Azure DevOps into a workspace subfolder, runs npm install, browser setup, and test verification. Use when the user asks to deploy the Playwright template, clone Playwright_automation_template, install the Everway Playwright template, or bootstrap Playwright tests from the QA template repo.
---

# Playwright Template Deploy

**Use this skill when the user wants the official Everway Playwright template deployed** (clone from Azure DevOps, install dependencies, configure environment, install browsers, run tests).

For a lightweight scaffold built from scratch (`agent-config.json`, `./E2E`), use **test-setup** instead.  See [reference.md](reference.md) for template URLs, directory map, and script tables.

## Role

You are a DevOps and Test Architect deploying the canonical Everway Playwright automation template.

## Required: ask the user first

**Do not clone or install until you have asked the user and received answers** (or they explicitly say "use defaults" or "defaults").  Cursor skills cannot pause for input automatically—you must ask in your reply and wait for the user's response before proceeding.

Ask in one message:

1. **Subfolder name** for the Playwright project inside the current workspace (e.g. `./e2e`, `./playwright-tests`).  Default is `./e2e` if they say "defaults".
2. **Optional app URLs and credentials** for `.env` and `config/` (e.g. `TEST_PAGE`, `N2Y_LOGIN_PAGE`, `N2Y_USERNAME`, `N2Y_PASSWORD`).  If skipped, copy `.env.example` as-is and tell the user what to edit later.
3. **If the target folder already exists**, confirm it is empty or acceptable to populate before proceeding.

**Do not ask for `GPT_KEY`.**  It is sensitive and must not be collected in chat.  The skill sets `ENABLE_AI_CHECKS=false` when no key is present at deploy time and tells the user to add `GPT_KEY` to `.env` themselves after deploy.

Only after the user replies should you clone and run setup.

## Task

When deploying the Playwright template, perform these steps in order:

### 1. Preflight checks

- Confirm `git` and `npm` are available.
- Resolve `{subfolder}` from the user's answer (default `./e2e`).
- If `{subfolder}` exists and is non-empty, stop and ask whether to abort, use a different path, or proceed (do not overwrite blindly).
- Verify the workspace root is the intended application repository (not the Agents skills repo unless the user explicitly wants the template there).

### 2. Clone the template

Clone from Azure DevOps into `{subfolder}`:

```bash
git clone https://dev.azure.com/texthelp-ltd/Test_Automation/_git/Playwright_automation_template <subfolder>
```

**On clone auth failure**, give actionable recovery steps:

- Sign in via Git Credential Manager or `az login`.
- Use a Personal Access Token with Code (Read) scope.
- SSH alternative: `git@ssh.dev.azure.com:v3/texthelp-ltd/Test_Automation/Playwright_automation_template`

Do not proceed until clone succeeds.

### 3. Normalise for embedded subfolder deploy

Because the template lives inside the application repo as a subfolder:

- Remove `{subfolder}/.git` so the app repo does not inherit the template's remote history.
- Do **not** create a git commit unless the user explicitly asks.

### 4. Install dependencies

Change directory to `{subfolder}`, then run:

```bash
npm install
```

All subsequent commands run from `{subfolder}` unless stated otherwise.

### 5. Configure environment

- Copy `.env.example` to `.env` if `.env` does not exist.
- Keep `TEST_ACCESSIBILITY=true` (already set in `.env.example`) unless the user asks to change it.
- **GPT_KEY / AI checks (do not prompt for the key):**
  - After copy, check whether `.env` has a non-empty `GPT_KEY`.
  - If `GPT_KEY` is missing or empty (normal at skill run time; never ask the user for it in chat), set `ENABLE_AI_CHECKS=false` in `.env` (add the line if missing).
  - State in your progress update: *GPT_KEY was not set at deploy time, so ENABLE_AI_CHECKS=false was applied for smoke verification.  After deploy you must open `{subfolder}/.env` and add your own GPT_KEY there (the skill will not ask for it in chat).*
  - If the user pasted a `GPT_KEY` into `.env` themselves before you configure it, or supplied one unprompted in an earlier message, you may set `ENABLE_AI_CHECKS=true` instead.
- Apply any other URLs or credentials the user supplied (e.g. `TEST_PAGE`, `N2Y_LOGIN_PAGE`, `N2Y_USERNAME`, `N2Y_PASSWORD`).  Do not ask for `GPT_KEY`.
- If the user gave a base URL, read `config/default.json` first and patch only relevant keys (e.g. `testPage`).  Do not overwrite the whole file.
- Template note: with `TEST_ACCESSIBILITY=true`, some bundled specs call `aiFeatureFile` in `beforeAll` even when `ENABLE_AI_CHECKS=false`.  Console may log OpenAI 401 until the user adds `GPT_KEY`; the deploy smoke test can still pass.

### 6. Install browsers (recommended path)

Default: Chrome for Testing beta (template recommended path):

```bash
npm run install:chrome-testing-beta
```

**Fallback:** if CfT install fails (network, platform, permissions), run:

```bash
npm run install:chromium
```

Document the fallback in your summary and use `npm run test:chromium` for verification instead of `test:chrome-testing-beta`.

### 7. Verify setup

Run in order from `{subfolder}`:

1. **Typecheck** (must pass):

   ```bash
   npm run typecheck
   ```

2. **Test discovery**:

   ```bash
   npm run test:chrome-testing-beta -- --list
   ```

   On **Windows PowerShell**, if extra args do not reach Playwright, use:

   ```bash
   cmd /c "npm run test:chrome-testing-beta -- --list"
   ```

   When using the Chromium fallback, substitute `test:chromium` in the commands above.

3. **Run the deploy smoke test** (single spec only; must pass on a fresh deploy without credentials):

   ```bash
   npm run test:chrome-testing-beta -- tests/singleTests/example_everway_homepage_language_selector_options.test.ts
   ```

   On **Windows PowerShell**, if the path does not pass through:

   ```bash
   cmd /c "npm run test:chrome-testing-beta -- tests/singleTests/example_everway_homepage_language_selector_options.test.ts"
   ```

   When using the Chromium fallback, substitute `test:chromium`.

   Do **not** run the full suite as part of deploy verification.  Other bundled specs may need `GPT_KEY`, generated `.feature` files, or N2Y credentials.

   - **Setup failures:** missing browsers, broken dependencies, TypeScript errors, or smoke test failure must be fixed before finishing.

### 8. Completion summary

**Mandatory:** every deploy must end with the **Action required: update `.env`** section below.  Do not omit it or bury it in optional steps.  The user must be told explicitly to open and edit the `.env` file.

Use this structure so the user gets a clear deploy report:

```markdown
## Playwright template deployed

**Location:** `{subfolder}`
**Browser:** Chrome for Testing beta (or Chromium if fallback)

### Action required: update `.env`

Deploy created `{subfolder}/.env` from `.env.example`.  **`GPT_KEY` was not set during deploy** (this skill never asks for that value in chat).

**You should now:**

1. **Open and examine** `{subfolder}/.env` in your editor.
2. **Set `GPT_KEY=`** to your OpenAI API key on the line that currently reads `GPT_KEY=` (empty).
3. **Set `ENABLE_AI_CHECKS=true`** in the same file once `GPT_KEY` is in place.
4. Review other values in `.env` (URLs, `N2Y_USERNAME`, `N2Y_PASSWORD`, etc.) and update any that apply to your environments.

Until `GPT_KEY` is added, AI helpers and Gherkin generation stay disabled (`ENABLE_AI_CHECKS=false` was applied for smoke verification).  You may still see console 401 errors from `beforeAll` hooks while `GPT_KEY` is empty.

### Verification
- `npm run typecheck` — passed
- Test discovery (`--list`) — passed
- Smoke test (`example_everway_homepage_language_selector_options.test.ts`) — passed

### Environment
- `TEST_ACCESSIBILITY=true` (template default)
- `ENABLE_AI_CHECKS=false` — applied because `GPT_KEY` was empty at deploy time

### Next steps
1. Complete the **Action required: update `.env`** steps above before running AI-enabled specs.
2. Update `config/default.json` if needed (`testPage`, N2Y URLs, etc.).
3. Run tests from `{subfolder}`: `npm run test:chrome-testing-beta`

### Optional
- Coverage: `npm run coverage` (after coverage-enabled specs)
- Allure: `npm run allure`
- Selectors: `common/selector.ts`

### Config note
This template uses `config/` + `.env` + `common/testConfig.ts`, not `agent-config.json`.  Downstream skills (`test-analyst`, `test-scripter`, `test-run-and-fix`) may assume `agent-config.json`; adapt paths or config when handoffing.
```

Fill in actual paths and pass/fail results from the verification run.  The **Action required: update `.env`** section is not optional.

## Rules

- **Do not overwrite** an existing non-empty `{subfolder}` without explicit user consent.
- **Do not commit** deployed files unless the user explicitly asks.
- **Never prompt for `GPT_KEY`** in chat.  **Always** end the deploy with the mandatory **Action required: update `.env`** section telling the user to open `{subfolder}/.env`, examine it, and add `GPT_KEY` themselves.
- **Do not use** the npm package install path (`@texthelp/qa-Playwrightemplate`) in v1; clone from Git only.
- **Run all install and test commands from `{subfolder}`** so `node_modules` and browsers are scoped to the test project.
- **Prefer the template README** in `{subfolder}/README.md` for project-specific details after deploy; this skill covers first-run deploy only.

## Summary checklist

- [ ] Asked user for subfolder (default `./e2e`), optional URLs/credentials, and confirmed target folder state
- [ ] Cloned `Playwright_automation_template` into `{subfolder}`
- [ ] Removed `{subfolder}/.git`
- [ ] Ran `npm install` from `{subfolder}`
- [ ] Created/configured `.env` from `.env.example` with `TEST_ACCESSIBILITY=true` and `ENABLE_AI_CHECKS=false` when `GPT_KEY` unset; noted that in progress and completion summary
- [ ] Patched `config/default.json` if user supplied a base URL
- [ ] Ran `npm run install:chrome-testing-beta` (or Chromium fallback)
- [ ] Verified: `npm run typecheck`, test discovery (`--list`), smoke test (`example_everway_homepage_language_selector_options.test.ts` only)
- [ ] Reported deploy summary with mandatory **Action required: update `.env`** (open file, add `GPT_KEY`, set `ENABLE_AI_CHECKS=true`), next edits, and config difference vs `test-setup`

## Additional resources

- Template constants, scripts, and verification caveats: [reference.md](reference.md)
- Human overview (Cursor): [documentation/cursor/playwright-template-deploy/README.md](../../../documentation/cursor/playwright-template-deploy/README.md)
- Human overview (Copilot): [documentation/coPilot/playwright-template-deploy/README.md](../../../documentation/coPilot/playwright-template-deploy/README.md)
- Copilot agent file: [`.github/agents/playwright_template_deploy.agent.md`](../../../.github/agents/playwright_template_deploy.agent.md)
