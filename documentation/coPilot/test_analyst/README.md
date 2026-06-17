# Test Analyst: Copilot agent

## Overview

This GitHub Copilot custom agent turns requirements or Azure DevOps PBIs into Gherkin feature files (`.feature`) and saves them in your repository.

## What this agent does

- Reads a **PBI** (work item) or pasted requirements
- Produces **Gherkin** scenarios (Given / When / Then)
- Writes a **`.feature` file** under your configured feature folder (from `agent-config.json` or your path)
- Keeps scenarios **clear, testable, and aligned** with the source requirements

## Prerequisites

- **GitHub Copilot** in Visual Studio Code with custom agents available.
- **`test_analyst.agent.md`** in **`.github/agents/`**.
- **Feature folder** from Playwright setup (`agent-config.json` → `featureDir`) or a path you specify.

## How to use this agent

### Agent file

- Ensure **`test_analyst.agent.md`** is in the **`.github/agents/`** folder.

### Select the agent in VS Code

- Open **GitHub Copilot Chat**, use the **agent** drop-down, and select this custom agent.

### Workflow context

*Typically follows test environment setup. Output feeds **Test Scripter** (Draft Test Script) for Playwright specs.*

## Example prompts

- *"Create a feature file from this PBI: [paste or link]"*
- *"Convert these acceptance criteria to Gherkin"*
- *"Write BDD scenarios for work item 12345"*

**Azure DevOps:** If you use the Azure DevOps MCP, you can ask the agent to pull PBIs by ID or query; otherwise paste the requirement text.

## Questions the agent may ask

| Question | Why |
|----------|-----|
| **Where should the `.feature` file go?** | Uses `featureDir` from `agent-config.json` when present; otherwise confirms path. |
| **What is the feature / epic name?** | For the file name and feature title in Gherkin. |
| **Any tags or naming conventions?** | Matches your team's BDD style. |

## What happens when you run it

The agent drafts Gherkin, writes or updates the `.feature` file, and summarises what it created.

## Outputs

| Item | Purpose |
|------|---------|
| `.feature` file(s) | Gherkin scenarios under your feature folder |
| Short summary in chat | File path and scenario outline |

## Handoffs

- **Draft Test Script** → **Test Scripter**: use the generated `.feature` as input to produce Playwright tests.

## Verification

- Open the `.feature` file and confirm scenarios match the source requirements and your team's Gherkin conventions.
