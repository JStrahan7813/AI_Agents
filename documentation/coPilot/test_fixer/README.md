# Test Fixer (Playwright): Copilot agent

## Overview

This GitHub Copilot custom agent validates and fixes Playwright selectors using live browser data (Playwright MCP). It finds `// GUESS` selectors, inspects the page, replaces them with robust selectors, and offers a handoff to the Test Runner to verify.

## What this agent does

- Reads **`agent-config.json`** to get **`baseUrl`**
- Parses the drafted **`.spec.ts`** file
- **Self-heals:** finds lines with `// GUESS`, navigates to the page via Playwright MCP, uses evaluation or screenshots to inspect the DOM, replaces guessed selectors with robust ones (data-testid, ARIA labels), and fixes test steps as needed from live data
- **Clean up:** removes `// GUESS` comments and saves the file
- Offers **handoff to Test Runner** to execute the test suite and verify everything passes

## Prerequisites

- **GitHub Copilot** in Visual Studio Code with custom agents available.
- **`test_fixer.agent.md`** in **`.github/agents/`**.
- **Playwright MCP** installed and enabled (required for live DOM inspection and selector fixes).

## How to use this agent

### Agent file

- Ensure **`test_fixer.agent.md`** is in the **`.github/agents/`** folder.
- **Playwright MCP** must be installed and enabled before asking the agent to fix selectors.

### Select the agent in VS Code

- Open **GitHub Copilot Chat**, use the **agent** drop-down, and select the **Test Fixer** custom agent.

### Workflow context

*Typically after **Test Scripter** or when **Test Runner** hands off with **Retry Fix**. The agent is often invoked via those handoffs rather than only from a cold prompt.*

## Example prompts

Handoff-style context (as used from other agents):

- From **Test Scripter** → **Fix selectors**: *"Draft code created. Please fix selectors using the Playwright MCP."*
- From **Test Runner** → **Retry Fix**: *"The test failed due to a selector or timeout issue. Please re-examine the page with the Playwright MCP."*

Direct prompts:

- *"Fix the selectors in the Playwright test"*
- *"Replace the GUESS selectors with real ones"*

## Questions the agent may ask

*This agent does not use a fixed pre-flight questionnaire; it proceeds from your prompt or handoff.*

## What happens when you run it

The agent reads config and the spec, uses the Playwright MCP to inspect the application, updates selectors, and removes `// GUESS` comments. Use the **Run tests** handoff to the Test Runner agent to verify.

## Outputs

| Action | Purpose |
|--------|---------|
| Read `agent-config.json` | Get `baseUrl` for navigation |
| Parse `.spec.ts` | Find lines with `// GUESS` |
| Playwright MCP (navigate, evaluate, screenshot) | Inspect live page and DOM |
| Replace selectors | data-testid, ARIA labels, stable structure |
| Remove `// GUESS` comments | Clean up and save |

## Handoffs

- **Run tests** → **Test Runner**: use after fixing selectors to execute the test suite and verify everything passes.

## Verification

- Use the **Run tests** handoff to **Test Runner**, or run `npx playwright test` yourself, and confirm the suite passes after selector updates.
