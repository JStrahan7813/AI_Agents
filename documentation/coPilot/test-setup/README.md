# Test Setup (Playwright): Copilot agent

## Overview

This GitHub Copilot custom agent initialises a full Playwright test automation environment in your project: configuration, folders, dependencies, an example test, and a project README.

## What this agent does

- Creates **package.json** with Playwright, TypeScript, Allure, axe-core, and related dependencies
- Creates **agent-config.json** with your chosen `baseUrl`, test folder, and feature folder
- Creates **playwright.config.ts** that loads settings from `agent-config.json` (ES modules, Allure, global setup)
- Creates the **directory structure** (test dir, feature dir, `{testDir}/setup`)
- Adds a **global setup** placeholder (`{testDir}/setup/global.setup.ts`) for pre-run logic (e.g. login)
- Installs dependencies (`npm install`, `npx playwright install`)
- Adds an **example test** that uses the configured base URL
- Creates a **README.md** in the project root explaining the environment

## Prerequisites

- **GitHub Copilot** in Visual Studio Code with custom agents available.
- **`test_setup.agent.md`** in **`.github/agents/`**.

## How to use this agent

### Agent file

- Ensure **`test_setup.agent.md`** is in the **`.github/agents/`** folder.

### Select the agent in VS Code

- Open **GitHub Copilot Chat**, use the **agent** drop-down, and select this custom agent.

### Workflow context

*This agent is usually the first step in the test-creation pipeline: run it before analysts, scripters, or runners need a Playwright layout.*

## Example prompts

Ask in natural language, for example:

- *"Create a Playwright test environment"*
- *"Set up a Playwright test environment"*
- *"I need a Playwright test environment set up"*
- *"Initialise Playwright tests"*

## Questions the agent may ask

The agent **will ask you** before creating anything:

| Question | What to provide | Default if you say "defaults" |
|----------|-----------------|--------------------------------|
| **Where should the test folder be created?** | e.g. `./tests`, `./tests/e2e`, `./e2e` | `./tests` |
| **Where should the feature folder be?** | e.g. `./features`, `./tests/e2e/features` | `./features` |
| **What is the base URL of the app under test?** | e.g. `https://localhost:3000`, `https://www.example.com` | (use a placeholder; you can edit `agent-config.json` later) |

You can reply with specific paths and URL, or say **"use defaults"** (or **"defaults"**) for the first two and optionally give a base URL.

## What happens when you run it

After you answer, the agent creates the files, runs `npm install` and `npx playwright install`, and may run a quick test to verify. You receive a summary of what was created and how to run tests.

## Outputs

| Item | Purpose |
|------|---------|
| `package.json` | Dependencies (Playwright, Allure, TypeScript, etc.) and npm scripts |
| `agent-config.json` | Shared config: `baseUrl`, `testDir`, `featureDir` (Playwright config reads this) |
| `playwright.config.ts` | Playwright config; loads from `agent-config.json`, sets Allure and global setup |
| `tsconfig.json` | TypeScript / ES module config |
| `{testDir}/setup/global.setup.ts` | Placeholder for one-off pre-run code (e.g. login) |
| `{testDir}/example.spec.ts` | Sample test using the base URL |
| `README.md` | Explains the Playwright environment (install, config, structure, how to run tests) |

Folders: your chosen `testDir`, `featureDir`, and `{testDir}/setup`.

## Handoffs

*This agent does not define handoffs in its profile.*

## Verification

- Run the example Playwright test (e.g. `npx playwright test` from the project root) to confirm the environment works.
- Adjust `agent-config.json` if you used a placeholder base URL.
