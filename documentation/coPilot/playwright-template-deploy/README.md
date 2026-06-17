# Playwright Template Deploy: Copilot agent

## Overview

This GitHub Copilot custom agent clones the official Everway [Playwright_automation_template](https://dev.azure.com/texthelp-ltd/Test_Automation/_git/Playwright_automation_template) from Azure DevOps into a subfolder of your workspace (default `./e2e`), runs the template's setup steps, and verifies the environment with typecheck, test discovery, and a smoke test.

Use this when you want the **standard Everway QA Playwright stack**.  For a lightweight scaffold built from scratch (`agent-config.json`), use the **Test Setup** agent instead.

## What this agent does

- Asks for a **subfolder name** (default `./e2e`) and optional URLs/credentials.
- **Clones** the template from Azure DevOps into that subfolder.
- **Removes** the template's `.git` directory so the test project embeds cleanly in your app repo.
- Runs **`npm install`**, copies **`.env.example`** to **`.env`**, keeps **`TEST_ACCESSIBILITY=true`**, and sets **`ENABLE_AI_CHECKS=false`** when **`GPT_KEY`** is not set (the agent never prompts for `GPT_KEY`).
- Installs **Chrome for Testing beta** (`npm run install:chrome-testing-beta`) and verifies with typecheck, test discovery, and smoke test **`example_everway_homepage_language_selector_options.test.ts`** only.
- Ends every deploy with an explicit **Action required: update `.env`** section telling you to open the file and add **`GPT_KEY`**.

## Prerequisites

- **GitHub Copilot** in Visual Studio Code with custom agents available.
- **`playwright_template_deploy.agent.md`** in **`.github/agents/`**.
- **Git** access to `texthelp-ltd/Test_Automation/Playwright_automation_template` (HTTPS or SSH).
- **Node.js** 18+ and **npm**.

## How to use this agent

### Agent file

- Ensure **`playwright_template_deploy.agent.md`** is in the **`.github/agents/`** folder.

### Select the agent in VS Code

- Open **GitHub Copilot Chat**, use the **agent** drop-down, and select **Playwright Template Deploy**.

### Workflow context

*Alternative first step in the Playwright pipeline: use this **or** **Test Setup**, not both.  This agent deploys the full Everway template; **Test Setup** scaffolds a minimal project with `agent-config.json`.*

### Copilot vs Cursor Playwright Template Deploy

The **Cursor** skill lives under **`.cursor/skills/playwright-template-deploy/`** with the same deploy workflow.  See [documentation/cursor/playwright-template-deploy/README.md](../../cursor/playwright-template-deploy/README.md).

## Example prompts

- *"Deploy the Playwright template into ./e2e"*
- *"Clone Playwright_automation_template and set up tests"*
- *"Install the Everway Playwright template"*
- *"Bootstrap Playwright tests from the QA template repo"*

## Questions the agent may ask

The agent **asks you in one message** before cloning:

| Question | What to provide | Default if you say "defaults" |
|----------|-----------------|--------------------------------|
| **Subfolder for the Playwright project** | e.g. `./e2e`, `./playwright-tests` | `./e2e` |
| **App URLs and credentials** (optional) | e.g. `TEST_PAGE`, `N2Y_LOGIN_PAGE`, `N2Y_USERNAME` | Copy `.env.example` as-is; edit later. **`GPT_KEY` is not requested** |
| **Target folder already exists?** | Confirm empty or acceptable | Agent stops if non-empty until you confirm |

## What happens when you run it

After you answer, the agent clones the repo into **`./e2e`** (unless you chose another subfolder), removes `.git`, runs `npm install`, configures `.env` (`ENABLE_AI_CHECKS=false` when no `GPT_KEY`), installs CfT beta, verifies with typecheck, `--list`, and the **`example_everway_homepage_language_selector_options`** smoke test.

**Every deploy ends with an explicit action required:** open and examine **`{subfolder}/.env`**, add your **`GPT_KEY`**, then set **`ENABLE_AI_CHECKS=true`**.

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

## Playwright Template Deploy vs Test Setup

| | **Test Setup** | **Playwright Template Deploy** |
|--|----------------|--------------------------------|
| Source | Generated from agent instructions | Cloned from ADO template |
| Config | `agent-config.json` | `config/` + `.env` + `testConfig.ts` |
| Test folder | `./tests` (default) | `tests/` |
| Browser | CfT beta via `@puppeteer/browsers` | CfT beta via template `install:chrome-testing-beta` |
| Best for | Lightweight/custom scaffold | Standard Everway QA stack |

## Handoffs

*This agent does not define handoffs in its profile.*

Suggested next steps after deploy:

- **Test Analyst** → **Test Scripter** → **Test Fixer** / **Test Runner** for new tests.
- Note: downstream agents may assume `agent-config.json`; this template uses `config/` and `.env` instead.

## Verification

From the **subfolder**:

- `npm run typecheck` should pass.
- `npm run test:chrome-testing-beta -- --list` should list specs (on Windows PowerShell use `cmd /c "npm run test:chrome-testing-beta -- --list"` if args do not pass through).
- Smoke test should pass (single spec only):

  ```bash
  npm run test:chrome-testing-beta -- tests/singleTests/example_everway_homepage_language_selector_options.test.ts
  ```

### Action required after every deploy

1. Open **`{subfolder}/.env`** and review its contents.
2. Set **`GPT_KEY=`** to your OpenAI API key (the line is left empty on purpose).
3. Set **`ENABLE_AI_CHECKS=true`** once `GPT_KEY` is in place.
4. Add N2Y or other credentials before running sign-in specs.

The full instructions Copilot follows are in **`.github/agents/playwright_template_deploy.agent.md`** (this README is only a summary).
