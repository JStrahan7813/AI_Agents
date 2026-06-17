# Test Runner (Playwright): Copilot agent

## Overview

This GitHub Copilot custom agent runs Playwright tests and interprets results. On selector or timeout failures it offers a handoff to the Test Fixer agent; on logic or assertion failures it explains the discrepancy to you.

## What this agent does

- Runs **`npx playwright test`**
- **If pass:** reports success
- **If fail:** reads the console output and determines the cause
- **Selector or timeout (e.g. "Element not found"):** offers **Retry Fix** handoff to Test Fixer to re-examine the page with the Playwright MCP
- **Logic or assertion error:** explains the discrepancy (no handoff)

## Prerequisites

- **GitHub Copilot** in Visual Studio Code with custom agents available.
- **`test_runner-agent.md`** in **`.github/agents/`**.
- Playwright tests and project setup in place (typically after **Test Scripter** and optionally **Test Fixer**).

## How to use this agent

### Agent file

- Ensure **`test_runner-agent.md`** is in the **`.github/agents/`** folder.

### Select the agent in VS Code

- Open **GitHub Copilot Chat**, use the **agent** drop-down, and select the **Test Runner** custom agent.

### Workflow context

*Typically after tests have been drafted (**Test Scripter**) and optionally fixed (**Test Fixer**). Use **Retry Fix** when failures look like selectors or timeouts.*

## Example prompts

- *"Run the Playwright tests"*
- *"Execute the tests"*
- *"npx playwright test"*

## Questions the agent may ask

*This agent does not use a fixed pre-flight questionnaire; it proceeds from your prompt or handoff.*

## What happens when you run it

The agent runs the test command and reports pass or fail. It relies on terminal output. If the failure is due to selectors or timeouts, use the **Retry Fix** handoff to the Test Fixer agent.

## Outputs

| Output | When |
|--------|------|
| Success message | All tests pass |
| Failure analysis + **Retry Fix** handoff | Selector or timeout failure |
| Explanation to you | Logic or assertion failure |

## Handoffs

- **Retry Fix** → **Test Fixer**: use when the test failed due to a selector or timeout issue so the Test Fixer can re-examine the page with the Playwright MCP.

## Verification

*No extra verification steps documented here.*
