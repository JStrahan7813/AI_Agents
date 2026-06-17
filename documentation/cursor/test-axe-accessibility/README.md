# Test Axe Accessibility (Playwright + axe-core): Cursor skill

## Overview

This Cursor skill sets up Playwright with **axe-core** for accessibility testing: helper module, report folders, and generated tests. It uses **Playwright MCP** to discover selectors from the live page before writing tests, so selectors reflect the accessibility tree rather than guesses from wording alone.

## What this skill does

- **Checks or installs** the axe-core package (**`@axe-core/playwright`**) if not already present
- **Creates folders** **`tests/helpers`** and **`tests/accessibility-reports`** if they do not exist
- **Creates or updates** **`tests/helpers/accessibility.ts`** so tests can run axe on a given selector and produce a **markdown report** (WCAG 2.1 Level AA and below)
- **Finds selectors with Playwright MCP** before creating tests: navigates to the page, captures a snapshot, derives stable selectors from the accessibility tree
- **Generates Playwright tests** that run axe on the specified area(s), with a stabilisation delay to reduce flakiness from dynamic content
- **Writes markdown reports** under **`tests/accessibility-reports`** with summary, violations, incomplete (manual review), and a sample of tested nodes

## Prerequisites

- **Cursor** with **`.cursor/skills/`** inside a workspace root.
- Skill definition: **`.cursor/skills/test-axe-accessibility/SKILL.md`**
- **Project skill:** `.cursor/skills/test-axe-accessibility/` in this repo, or **user skill:** copy the folder to `%USERPROFILE%\.cursor\skills\test-axe-accessibility\` (Windows) or `~/.cursor/skills/test-axe-accessibility/` (macOS/Linux).
- **Playwright MCP** installed and enabled (navigation and snapshot for selector discovery).
- A Playwright layout (e.g. from **test-setup**) and **`baseUrl`** (e.g. in **`agent-config.json`**) so the app can be opened and axe run.

## How to use this skill

### Skill file

- Keep **`SKILL.md`** under **`.cursor/skills/test-axe-accessibility/`**.

### Invoke in Cursor

- Use **Agent** chat and plain-language prompts, or **`/`** to pick the skill. See [documentation/cursor/README.md](../README.md).

### Workflow context

*Best after **test-setup** (and optionally alongside functional tests from **test-scripter**). Keeps accessibility checks in the same Playwright stack.*

## Example prompts

- *"Create an accessibility test environment"*
- *"Set up accessibility testing with Playwright and axe"*
- *"Create an accessibility test for the page body"*
- *"Accessibility test for the header"* / *"a11y test for #main-content"*
- *"Generate axe-core reports in markdown"*

## Questions the skill may ask

| Question | Why |
|----------|-----|
| **Which part of the page should be tested?** | Drives MCP snapshot and selector choice (e.g. body, header, main). |
| **URL or selector if MCP is unavailable?** | Fallback when the browser MCP cannot run. |

## What happens when you run it

Helpers and folders are created or updated, MCP discovers selectors where possible, a test file is added, and markdown reports are written under **`tests/accessibility-reports`**. You get a short summary of paths and how to run the tests.

## Outputs

| Item | Purpose |
|------|---------|
| `tests/helpers/` | Shared helpers (created if missing) |
| `tests/accessibility-reports/` | Markdown reports (created if missing) |
| `tests/helpers/accessibility.ts` | Runs axe on a selector, WCAG 2.1 AA scope, formats markdown, writes reports |
| `tests/accessibility.spec.ts` or `tests/a11y-<area>.spec.ts` | Playwright test: navigate, wait, run helper with MCP-derived selector(s), produce report |

Reports include: area(s) tested, summary counts, sample of tested nodes, violations (with affected nodes), and incomplete rules (nodes to review manually).

## Handoffs

*This skill does not define formal handoffs; continue with your team’s CI and review process for accessibility findings.*

## Verification

- Run the new accessibility spec with Playwright; open markdown reports under **`tests/accessibility-reports`** and check violations and incomplete items.
- The full instructions Cursor follows are in **`.cursor/skills/test-axe-accessibility/SKILL.md`** (this README is only a summary).
