# Test Setup (Playwright): Cursor skill

## Overview

This Cursor skill initialises a Playwright test automation environment **inside a chosen project root** (e.g. `./e2e`): configuration, folders, dependencies, browser code coverage (Chromium, Istanbul, Cobertura for Azure DevOps), an example test that wires coverage, and a project README.  All artefacts live under that root so tests stay separate from application code.

## What this skill does

- Asks for a **project root**, then **test** and **feature** folder paths **within** that root, and **base URL** (see below).
- Creates **`package.json`** with Playwright, TypeScript, Allure, axe-core, **v8-to-istanbul**, **istanbul-lib-coverage**, **istanbul-lib-report**, **istanbul-reports** (Istanbul → Cobertura), and npm scripts including **`test`**, **`test:coverage`**, and **`coverage:cobertura`**.
- Creates **`agent-config.json`** and **`playwright.config.ts`** (ES modules, Allure, **globalSetup** to `{testDir}/setup/global.setup.ts`, **baseUrl** from `agent-config.json`).
- Creates **`{testDir}/setup/coverage.ts`** (browser JS/CSS coverage → V8 and Istanbul; uses **`entry.source`** for remote URLs where Playwright provides it).
- Creates **`scripts/istanbul-to-cobertura.cjs`** to produce **`coverage/cobertura-coverage.xml`** for Azure DevOps.
- Creates **`docs/code-coverage-azure-devops.md`** inside the project root explaining coverage collection and publishing Cobertura in Pipelines.
- Creates **`{testDir}/setup/global.setup.ts`** when missing, **`{testDir}/example.spec.ts`** with **Chromium-only** coverage hooks (`startCoverage` / `stopCoverage` from `./setup/coverage.js`), **`.gitignore`** (including `coverage/`), and a **README.md** under the project root.
- Runs **`npm install`** and **`npx playwright install`** from **inside** the project root.

## Prerequisites

- **Cursor** with this repository (or a copy of the skill) open so **`.cursor/skills/`** is inside a workspace root.
- Skill definition: **`.cursor/skills/test-setup/SKILL.md`**
- **Project skill:** `.cursor/skills/test-setup/` in this repo (only this project), or **user skill:** copy the `test-setup` folder to `%USERPROFILE%\.cursor\skills\test-setup\` (Windows) or `~/.cursor/skills/test-setup/` (macOS/Linux) to use it in any repo.

## How to use this skill

### Skill file

- Keep **`SKILL.md`** (and this skill folder) under **`.cursor/skills/test-setup/`** as above.

### Invoke in Cursor

- Use **Agent** chat so skills apply. Describe the task in plain language so Cursor can match this skill’s description, or type **`/`** and pick the skill.
- See the hub guide: [documentation/cursor/README.md](../README.md) (using and invoking Cursor skills).

### Workflow context

*Usually the first step in the test pipeline: run it before analysts, scripters, or run-and-fix workflows need a Playwright layout.*

### Cursor vs Copilot Test Setup

The **GitHub Copilot** [Test Setup agent](../../coPilot/test-setup/README.md) under **`.github/agents/`** follows **`test_setup.agent.md`** (different prompts and stack, e.g. Chrome for Testing Beta).  This **Cursor** skill is the one with **browser coverage**, Istanbul, and Cobertura as described in **`.cursor/skills/test-setup/SKILL.md`**.

## Example prompts

- *"Create a Playwright test environment"*
- *"Set up a Playwright test environment"*
- *"I need a Playwright test environment set up"*
- *"Initialise Playwright tests"*
- *"Playwright E2E with Cobertura for Azure DevOps"*

## Questions the skill may ask

The skill **asks you in one message** before creating anything:

| Question | What to provide | Default if you say "defaults" |
|----------|-----------------|--------------------------------|
| **Where should the Playwright project root be?** | e.g. `./e2e`, `./playwright-tests` (all config and tests go **inside** this folder) | `./e2e` |
| **Within that root, where should the test folder be?** | e.g. `./E2E`, `./tests` | `./E2E` |
| **Within that root, where should the feature folder be?** | e.g. `./features` | `./features` |
| **What is the base URL of the app under test?** | e.g. `https://localhost:3000`, `https://example.com` | Placeholder `https://example.com` if skipped; edit **`agent-config.json`** later |

You can reply with paths and URL, or say **"use defaults"** (or **"defaults"**) for items 1-3 and optionally provide a base URL for item 4.

## What happens when you run it

After you answer, files are created under **`projectRoot`**, **`npm install`** and **`npx playwright install`** run there, and you get a summary.  Run tests and coverage commands from **inside** the project root (e.g. `cd e2e` then `npm test` or `npm run test:coverage`).

## Outputs

Paths are relative to **`projectRoot`** unless noted.

| Item | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts: `test`, `test:coverage`, `coverage:cobertura`, Allure helpers as applicable |
| `agent-config.json` | `baseUrl`, `testDir`, `featureDir` (relative to project root) |
| `playwright.config.ts` | Loads **`agent-config.json`**, Allure, **globalSetup** |
| `tsconfig.json` | TypeScript / ES module resolution (explicit **`.js`** imports for compiled `.ts` where required) |
| `.gitignore` | Excludes `node_modules/`, test artefacts, **`coverage/`** |
| `{testDir}/setup/global.setup.ts` | Pre-run hook placeholder (created only if missing) |
| `{testDir}/setup/coverage.ts` | Browser coverage helper; Chromium-oriented API usage |
| `{testDir}/example.spec.ts` | Sample test with **base URL** and **coverage** (Chromium-only guard) |
| `scripts/istanbul-to-cobertura.cjs` | Istanbul → **`coverage/cobertura-coverage.xml`** |
| `docs/code-coverage-azure-devops.md` | How coverage works and how to publish Cobertura in Azure Pipelines |
| `coverage/` | V8 JSON, `playwright-istanbul.json`, **`cobertura-coverage.xml`** after `coverage:cobertura` or `test:coverage` |
| `README.md` | Project overview, install, config, structure, running tests, global setup, **code coverage** |

Folders: **`projectRoot`**, `{testDir}`, `{featureDir}`, `{testDir}/setup`, **`scripts`**, **`docs`**.

## Handoffs

*This skill does not define formal handoffs.*

## Verification

- From **`projectRoot`**: `npx playwright test` (or `npm test`) to confirm the environment works.
- **`npm run test:coverage`** or **`npm run coverage:cobertura`** after a Chromium run with coverage, if you need Cobertura XML.
- Adjust **`agent-config.json`** if you used a placeholder base URL.
- The full instructions Cursor follows are in **`.cursor/skills/test-setup/SKILL.md`** (this README is only a summary).
