# Test Run and Fix (Playwright): Cursor skill

## Overview

This Cursor skill runs Playwright tests and fixes selector failures using live browser data (Playwright MCP). It executes tests, interprets failures, and self-heals **`// GUESS`** selectors when failures are due to missing elements or timeouts. You can also invoke it only to fix selectors.

## What this skill does

- Runs **`npx playwright test`** and reads the terminal output
- **If tests pass:** reports success
- **If tests fail:** decides whether the failure is selector/timeout or logic/assertion
- **Selector or timeout (e.g. "Element not found"):** reads **`agent-config.json`** and the failing **`.spec.ts`**, uses Playwright MCP to navigate and inspect the DOM, replaces **`// GUESS`** selectors with robust ones (data-testid, ARIA, etc.), removes **`// GUESS`** comments, then re-runs tests
- **Logic or assertion error:** explains the discrepancy (no selector fix)
- Supports **selector-only** requests (e.g. *"fix the GUESS selectors in my test"*)

## Prerequisites

- **Cursor** with **`.cursor/skills/`** inside a workspace root.
- Skill definition: **`.cursor/skills/test-run-and-fix/SKILL.md`**
- **Project skill:** `.cursor/skills/test-run-and-fix/` in this repo, or **user skill:** copy the folder to `%USERPROFILE%\.cursor\skills\test-run-and-fix\` (Windows) or `~/.cursor/skills/test-run-and-fix/` (macOS/Linux).
- **Playwright MCP** installed and enabled (`playwright_navigate`, `playwright_evaluate`, `playwright_screenshot`, etc.) for the fix workflow.
- Tests and **`agent-config.json`** (with **`baseUrl`**) should already exist (e.g. from **test-setup** and **test-scripter**).

## How to use this skill

### Skill file

- Keep **`SKILL.md`** under **`.cursor/skills/test-run-and-fix/`**.

### Invoke in Cursor

- Use **Agent** chat and plain-language prompts, or **`/`** to pick the skill. See [documentation/cursor/README.md](../README.md).

### Workflow context

*Typically after **test-scripter** (draft specs). Re-run after fixes until the suite is green or remaining failures are logic-related.*

## Example prompts

- *"Run the Playwright tests"*
- *"Execute the tests"*
- *"npx playwright test"*
- *"Fix the selectors in my test"*
- *"Fix the GUESS selectors"*
- *"Self-heal the selectors"*
- *"Why did my test fail?"* / *"Debug the failing test"*

## Questions the skill may ask

*This skill does not use a fixed pre-flight questionnaire; it proceeds from your prompt and test output.*

## What happens when you run it

Tests run; if failures look selector-related, selectors are updated and tests run again. You get a pass/fail summary and a note of any file changes.

## Outputs

| Output / action | When |
|-----------------|------|
| Success message | All tests pass |
| Failure analysis + selector fixes + re-run | Selector or timeout failure |
| Explanation only | Logic or assertion failure |
| Read **`agent-config.json`** | Obtain **`baseUrl`** for navigation |
| Parse failing **`.spec.ts`** | Find **`// GUESS`** lines |
| Playwright MCP (navigate, evaluate, screenshot) | Inspect live page and DOM |
| Replace selectors; remove **`// GUESS`** | Updated spec file on disk |
| Re-run **`npx playwright test`** | Verify fixes |

## Handoffs

*This skill does not define formal handoffs; it often follows **test-scripter** and can loop until tests pass or non-selector issues remain.*

## Verification

- Confirm the suite passes after a fix cycle, or that logic failures are understood.
- The full instructions Cursor follows are in **`.cursor/skills/test-run-and-fix/SKILL.md`** (this README is only a summary).
