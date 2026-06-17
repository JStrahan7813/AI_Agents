# Test Scripter (Playwright): Cursor skill

## Overview

This Cursor skill drafts initial Playwright test code from a **`.feature`** file or from a test description you provide. It uses **`agent-config.json`**, writes a **`.spec.ts`** and helper module, and marks selectors with **`// GUESS`** for later fixing with **test-run-and-fix**.

## What this skill does

- Reads **agent-config.json** and asks for **baseUrl** if not set; stores it for this test
- Reads a **`.feature`** file (or asks you for a test description if none is provided)
- Writes a **`.spec.ts`** file under **`./tests/`** using Playwright Test
- Creates **helper functions** for page elements and actions in **`./tests/helpers/<feature-name>.ts`**
- Uses **test.describe**, **test.beforeEach**, **test.afterEach** and imports config for navigation
- Marks every selector with **`// GUESS`** (no browser access during drafting)
- Suggests using the **test-run-and-fix** skill next to run tests and fix selectors

## Prerequisites

- **Cursor** with **`.cursor/skills/`** inside a workspace root.
- Skill definition: **`.cursor/skills/test-scripter/SKILL.md`**
- **Project skill:** `.cursor/skills/test-scripter/` in this repo, or **user skill:** copy the folder to `%USERPROFILE%\.cursor\skills\test-scripter\` (Windows) or `~/.cursor/skills/test-scripter/` (macOS/Linux).
- **`agent-config.json`** (from **test-setup**) with **`baseUrl`** when possible.

## How to use this skill

### Skill file

- Keep **`SKILL.md`** under **`.cursor/skills/test-scripter/`**.

### Invoke in Cursor

- Use **Agent** chat and plain-language prompts, or **`/`** to pick the skill. See [documentation/cursor/README.md](../README.md).

### Workflow context

*Runs after **test-analyst** (feature file) or when you already have a written scenario. Feeds **test-run-and-fix** for execution and selector healing.*

## Example prompts

- *"Write a Playwright test from this feature file"*
- *"Create a `.spec.ts` from the scenario"*
- *"Draft test code from the acceptance criteria"*
- *"Generate the draft Playwright test script"* (e.g. after the analyst created a feature file)

## Questions the skill may ask

| Question | Why |
|----------|-----|
| **Where is the `.feature` file, or what is the test description?** | Drives spec content when no file is in context. |
| **What is the base URL?** | Filled into `agent-config.json` if missing. |

## What happens when you run it

The **`.spec.ts`** and helper file are created; you are encouraged to run **test-run-and-fix** so Playwright MCP can replace **`// GUESS`** selectors with stable ones.

## Outputs

| Item | Purpose |
|------|---------|
| `./tests/<name>.spec.ts` | Playwright test file implementing the feature or scenario steps |
| `./tests/helpers/<feature-name>.ts` | Helper functions for page elements and actions |

The spec imports config from **`../agent-config.json`** for navigation. Selectors start with **`// GUESS`** comments.

## Handoffs

- **Run and fix tests** → **test-run-and-fix** skill: execute tests and heal selectors with Playwright MCP.

## Verification

- Run **`npx playwright test`** (or your project script) on the new spec; use **test-run-and-fix** if selectors fail.
- The full instructions Cursor follows are in **`.cursor/skills/test-scripter/SKILL.md`** (this README is only a summary).
