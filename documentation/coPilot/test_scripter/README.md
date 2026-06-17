# Test Scripter: Copilot agent

## Overview

This GitHub Copilot custom agent drafts Playwright test code from a `.feature` file or a plain-language test description, using your project's `agent-config.json` for paths and base URL.

## What this agent does

- Reads a **Gherkin** `.feature` file or your **test description**
- Produces **Playwright** TypeScript (`.spec.ts`) aligned with your config
- Uses **selectors and flows** consistent with your app (and **Playwright MCP** when available for live page structure)
- Places output under your configured **test directory**

## Prerequisites

- **GitHub Copilot** in Visual Studio Code with custom agents available.
- **`test_scripter.agent.md`** in **`.github/agents/`**.
- **`agent-config.json`** (from test setup): `baseUrl`, `testDir`, `featureDir`.
- **Playwright MCP** (optional): helps the agent inspect the live app for selectors.

## How to use this agent

### Agent file

- Ensure **`test_scripter.agent.md`** is in the **`.github/agents/`** folder.

### Select the agent in VS Code

- Open **GitHub Copilot Chat**, use the **agent** drop-down, and select this custom agent.

### Workflow context

*Runs after **Test Analyst** (feature file) or when you have a written scenario. Feeds **Test Runner** and **Test Fixer**.*

## Example prompts

- *"Write a Playwright test from `features/login.feature`"*
- *"Create a spec for scenario: Given I am on the login page…"*
- *"Draft tests for the checkout feature file"*

## Questions the agent may ask

| Question | Why |
|----------|-----|
| **Which scenario or `.feature` file?** | Scope and file path. |
| **Any Page Object or folder conventions?** | Matches your repo layout. |
| **Stable selectors or accessibility roles?** | Aligns with your testing standards. |

## What happens when you run it

The agent writes or updates `.spec.ts` file(s), follows your `agent-config.json`, and summarises paths and what was covered.

## Outputs

| Item | Purpose |
|------|---------|
| `.spec.ts` file(s) | Playwright tests under your `testDir` |
| Chat summary | Files touched and scenarios implemented |

## Handoffs

- **Run tests** → **Test Runner**: execute the new specs.
- **Failing tests** → **Test Fixer**: use when selectors or flows break.

## Verification

- Run `npx playwright test` (or your project script) on the new spec(s) and fix any environment-specific issues.
