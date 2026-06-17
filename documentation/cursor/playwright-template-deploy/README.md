# Playwright Template Deploy: Cursor skill

## Overview

This Cursor skill clones the official Everway [Playwright_automation_template](https://dev.azure.com/texthelp-ltd/Test_Automation/_git/Playwright_automation_template) from Azure DevOps into a subfolder of your application workspace (default `./e2e`), runs the template's setup steps, and verifies the environment with typecheck, test discovery, and a test run.

Use this when you want the **standard Everway QA Playwright stack**.  For a lightweight scaffold built from scratch, use **test-setup** instead.

## What this skill does

- Asks for a **subfolder name** (default `./e2e`) and optional URLs/credentials.
- **Clones** the template from Azure DevOps into that subfolder.
- **Removes** the template's `.git` directory so the test project embeds cleanly in your app repo.
- Runs **`npm install`**, copies **`.env.example`** to **`.env`**, keeps **`TEST_ACCESSIBILITY=true`**, and sets **`ENABLE_AI_CHECKS=false`** when **`GPT_KEY`** is not set (the skill never prompts for `GPT_KEY`).
- Installs **Chrome for Testing beta** (`npm run install:chrome-testing-beta`) and verifies with typecheck, test discovery, and smoke test **`example_everway_homepage_language_selector_options.test.ts`** only.

## Prerequisites

- **Cursor** with **`.cursor/skills/`** inside a workspace root.
- Skill definition: **`.cursor/skills/playwright-template-deploy/SKILL.md`**
- **Git** access to `texthelp-ltd/Test_Automation/Playwright_automation_template` (HTTPS or SSH).
- **Node.js** 18+ and **npm**.
- **Project skill:** `.cursor/skills/playwright-template-deploy/` in this repo, or **user skill:** copy the folder to `%USERPROFILE%\.cursor\skills\playwright-template-deploy\` (Windows) or `~/.cursor/skills/playwright-template-deploy/` (macOS/Linux).

## How to use this skill

### Skill file

- Keep **`SKILL.md`** under **`.cursor/skills/playwright-template-deploy/`** as above.

### Invoke in Cursor

- Use **Agent** chat so skills apply.  Describe the task in plain language so Cursor can match this skill's description, or type **`/`** and pick the skill.
- See the hub guide: [documentation/cursor/README.md](../README.md).

### Workflow context

*Alternative first step in the Playwright pipeline: use this **or** **test-setup**, not both.  This skill deploys the full Everway template; **test-setup** scaffolds a minimal project with `agent-config.json`.*

### Cursor vs Copilot Playwright Template Deploy

The **GitHub Copilot** [Playwright Template Deploy agent](../../coPilot/playwright-template-deploy/README.md) under **`.github/agents/`** follows **`playwright_template_deploy.agent.md`**.  This **Cursor** skill is the equivalent under **`.cursor/skills/playwright-template-deploy/SKILL.md`**.

## Example prompts

- *"Deploy the Playwright template into ./e2e"*
- *"Clone Playwright_automation_template and set up tests"*
- *"Install the Everway Playwright template"*
- *"Bootstrap Playwright tests from the QA template repo"*

## Questions the skill may ask

The skill **asks you in one message** before cloning:

| Question | What to provide | Default if you say "defaults" |
|----------|-----------------|--------------------------------|
| **Subfolder for the Playwright project** | e.g. `./e2e`, `./playwright-tests` | `./e2e` |
| **App URLs and credentials** (optional) | e.g. `TEST_PAGE`, `N2Y_LOGIN_PAGE`, `N2Y_USERNAME` | Copy `.env.example` as-is; edit later. **`GPT_KEY` is not requested** — add it to `.env` yourself after deploy |
| **Target folder already exists?** | Confirm empty or acceptable | Agent stops if non-empty until you confirm |

## What happens when you run it

After you answer, the agent clones the repo into **`./e2e`** (unless you chose another subfolder), removes `.git`, runs `npm install`, configures `.env` (`ENABLE_AI_CHECKS=false` when no `GPT_KEY`), installs CfT beta, verifies with typecheck, `--list`, and the **`example_everway_homepage_language_selector_options`** smoke test.

**Every deploy ends with an explicit action required:** open and examine **`{subfolder}/.env`**, add your **`GPT_KEY`**, then set **`ENABLE_AI_CHECKS=true`**.  The skill never asks for `GPT_KEY` in chat.

## Outputs

Paths are relative to the chosen **subfolder** (e.g. `./e2e`).

| Item | Purpose |
|------|---------|
| Full template tree | `tests/`, `common/`, `config/`, `fixture/`, `playwright.config.ts`, etc. |
| `.env` | Secrets and env overrides (from `.env.example`) |
| `config/default.json` | Base config; patched if you supplied a URL |
| `node_modules/` | Dependencies after `npm install` |
| `.browsers/` | Chrome for Testing beta after `install:chrome-testing-beta` |
| `report/` | Test results, coverage, Allure output after test runs |

## playwright-template-deploy vs test-setup

| | **test-setup** | **playwright-template-deploy** |
|--|----------------|--------------------------------|
| Source | Generated from skill instructions | Cloned from ADO template |
| Config | `agent-config.json` | `config/` + `.env` + `testConfig.ts` |
| Test folder | `./E2E` (default) | `tests/` |
| Browser | Chromium + coverage helper | CfT beta recommended |
| Best for | Lightweight/custom scaffold | Standard Everway QA stack |

## Handoffs

Suggested next steps after deploy:

- **test-analyst** → **test-scripter** → **test-run-and-fix** for new tests.
- Note: downstream skills may assume `agent-config.json`; this template uses `config/` and `.env` instead.

## Verification

From the **subfolder**:

- `npm run typecheck` should pass.
- `npm run test:chrome-testing-beta -- --list` should list specs (on Windows PowerShell use `cmd /c "npm run test:chrome-testing-beta -- --list"` if args do not pass through).
- Smoke test should pass (single spec only):

  ```bash
  npm run test:chrome-testing-beta -- tests/singleTests/example_everway_homepage_language_selector_options.test.ts
  ```

- Other bundled specs are not run during deploy.

### Action required after every deploy

1. Open **`{subfolder}/.env`** and review its contents.
2. Set **`GPT_KEY=`** to your OpenAI API key (the line is left empty on purpose).
3. Set **`ENABLE_AI_CHECKS=true`** once `GPT_KEY` is in place.
4. Add N2Y or other credentials before running sign-in specs.

The full instructions Cursor follows are in **`.cursor/skills/playwright-template-deploy/SKILL.md`** (this README is only a summary).
