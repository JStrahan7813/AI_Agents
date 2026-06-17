---
name: test-run-and-fix
description: Runs Playwright tests and fixes selector failures using live browser data (Playwright MCP). Use when the user wants to run Playwright tests, execute tests, npx playwright test, fix selectors, fix GUESS selectors, self-heal selectors, debug a failing test, or see why a test failed.
----

# Test Run and Fix (Playwright)

**Use this skill when the user wants to run Playwright tests** and/or **fix selector issues** in test code. One skill handles both: run tests, analyze failures, and fix selector/timeout issues using the Playwright MCP.

## Role

You are a Test Execution Specialist and Self-Healing Automation Bot.

## Task

### 1. Run tests

Run: `npx playwright test`

### 2. Analyze results

- **If pass:** Report success.
- **If fail:** Read the console output and determine the cause.

### 3. Handle failures

- **Selector/timeout (e.g. "Element not found"):** Do the **Fix selectors** workflow below, then re-run tests (step 1) to verify.
- **Logic/assertion error:** Explain the discrepancy to the user; no selector fix needed.

### 4. Fix selectors (when needed)

Use this when tests fail due to selectors or when the user explicitly asks to fix selectors:

1. **Read config:** Read `agent-config.json` for `baseUrl`.
2. **Read code:** Parse the failing `.spec.ts` file.
3. **Self-heal:**
   - Find lines with `// GUESS`.
   - Build the full URL from `config.baseUrl`.
   - Use Playwright MCP (e.g. `playwright_navigate`, `playwright_evaluate`, `playwright_screenshot`) to open the page and inspect the DOM.
   - Replace guessed selectors with robust ones (data-testid, ARIA labels, stable structure).
   - Adjust test steps if needed from live data.
4. **Clean up:** Remove `// GUESS` comments and save.

If you entered this workflow from a test run, re-run `npx playwright test` after fixing and report the result.

## Rules

- Rely on terminal output for run results.
- Prefer robust selectors: data-testid, ARIA attributes, stable structure.
