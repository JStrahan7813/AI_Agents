# AI Test Creator – Agents Usage Guide

> Last updated: 2026-03-27

This document describes the **Playwright test pipeline** (order, handoffs, and quick troubleshooting) and catalogues **every custom agent** shipped under `.github/agents/` with links to fuller notes.  

For **Visual Studio Code setup**, **MCP installation** (`mcp.json`, galleries, verification), **multi-root workspaces**, **copying agent files into another repository**, and **invoking agents in chat**, use the hub guide: [documentation/coPilot/README.md](README.md).

## Table of contents

- [Agent catalogue](#agent-catalogue)
  - [Playwright pipeline (handoffs)](#playwright-pipeline-handoffs)
  - [Standalone and other agents](#standalone-and-other-agents)
- [Prerequisites](#prerequisites)
- [Running agents](#running-agents)
- [Setup Agent](#setup-agent)
- [Analyst Agent](#analyst-agent)
- [Test Scripter Agent](#test-scripter-agent)
- [Test Fixer Agent](#test-fixer-agent)
- [Test Runner Agent](#test-runner-agent)
- [Orchestrated workflow (quick start)](#orchestrated-workflow-quick-start)
- [Troubleshooting](#troubleshooting)
- [Reference commands](#reference-commands)

## Agent catalogue

### Playwright pipeline (handoffs)

These five agents form the usual **linear** flow for browser automation: each step feeds the next, and several agent files declare **`handoffs`** in YAML so GitHub Copilot can suggest the next agent when appropriate.

| Order | Agent | Role | Documentation |
|-------|--------|------|----------------|
| 1a | **Test Setup** | Initialise Playwright layout, config, example test (from scratch) | [test-setup/README.md](test-setup/README.md) |
| 1b | **Playwright Template Deploy** | Clone official Everway `Playwright_automation_template` into a subfolder (default `./e2e`) | [playwright-template-deploy/README.md](playwright-template-deploy/README.md) |
| 2 | **Test Analyst** | Requirements or PBI → Gherkin `.feature` | [test_analyst/README.md](test_analyst/README.md) |
| 3 | **Test Scripter** | Gherkin → draft Playwright `.spec.ts` (e.g. `// GUESS` selectors) | [test_scripter/README.md](test_scripter/README.md) |
| 4 | **Test Fixer** | Self-heal selectors with Playwright MCP | [test_fixer/README.md](test_fixer/README.md) |
| 5 | **Test Runner** | Run tests; offer handoff back to Test Fixer on selector failures | [test_runner/README.md](test_runner/README.md) |

Optional **before** the Analyst step: run **Story Architect** (below) to refine an Azure DevOps work item, then hand off to Test Analyst for Gherkin.

Commit artefacts after each stage if you want a clear history of features, drafts, and stabilised tests.

### Standalone and other agents

These are **not** the same five-step Playwright pipeline.  Use them when the task matches; combine with the pipeline only if you choose to.

| Agent | Role | Documentation |
|-------|------|----------------|
| **Story Architect** | Review PBIs/stories in Azure DevOps for clarity and testability; optional update of work items; handoff **Create Test Scenarios** → Test Analyst | [test_story_architect/README.md](test_story_architect/README.md) |
| **Pact Architect** | Consumer and provider **Pact** contract tests (`@pact-foundation/pact`) | [test_pact/README.md](test_pact/README.md) |
| **Contract provider–seeded consumer** | From a **provider** repo only: seed **consumer-side** Pact tests when no consumer exists | [contract-provider-seeded-consumer/README.md](contract-provider-seeded-consumer/README.md) |

## Prerequisites

- **Node.js (LTS)** and **npm** where you run Playwright or Node-based tooling.
- **Which MCP servers you need** depends on the agent: open that agent’s file under [`.github/agents/`](../../.github/agents/), read the **`tools:`** block in the YAML at the top, and enable matching servers in VS Code.  Step-by-step install, `mcp.json`, and verification: [README.md — MCP servers for Copilot agents](README.md#mcp-servers-for-copilot-agents).

## Running agents

- Agent definitions live under **`.github/agents/`** as `*.agent.md`, except **`test_runner-agent.md`** (hyphenated name).
- **How to choose a custom agent in VS Code**, use Copilot Chat, and related UI: [README.md — Invoking custom agents in VS Code](README.md#invoking-custom-agents-in-vs-code).
- Example file: [test_runner-agent.md](../../.github/agents/test_runner-agent.md).

If your application code lives in a **different** Git checkout from this Agents repository, see [README.md — Copilot agent files with another repository](README.md#copilot-agent-files-with-another-repository).

## Setup Agent

**Purpose:** Initialise the local Playwright environment (folders, `agent-config`, example test).  **Detail:** [test-setup/README.md](test-setup/README.md).

**Typical prompts / outputs:** see that README (environment questions, `baseUrl`, npm install).

## Playwright Template Deploy Agent

**Purpose:** Clone and deploy the official Everway [Playwright_automation_template](https://dev.azure.com/texthelp-ltd/Test_Automation/_git/Playwright_automation_template) into a workspace subfolder, install dependencies and CfT beta, run smoke verification.  **Detail:** [playwright-template-deploy/README.md](playwright-template-deploy/README.md).

**Typical prompts / outputs:** see that README (subfolder default `./e2e`, `.env` with `ENABLE_AI_CHECKS=false` when `GPT_KEY` unset, mandatory **Action required: update `.env`** after deploy).  Use **Test Setup** or **Playwright Template Deploy** as step 1, not both.

## Analyst Agent

**Purpose:** PBI or pasted requirements → Gherkin under your feature folder.  **Detail:** [test_analyst/README.md](test_analyst/README.md).

Optional **Azure DevOps MCP** for work items; otherwise paste requirements (see README).

## Test Scripter Agent

**Purpose:** `.feature` or description → Playwright `.spec.ts` and helpers.  **Detail:** [test_scripter/README.md](test_scripter/README.md).

**Inputs:** usually output from Test Analyst.  **Outputs:** specs with `// GUESS` markers until Test Fixer runs.

## Test Fixer Agent

**Purpose:** Replace `// GUESS` selectors using live DOM (Playwright MCP).  **Detail:** [test_fixer/README.md](test_fixer/README.md).

**Inputs:** failing or draft specs; app reachable at `agent-config.json` **baseUrl** when using MCP.

## Test Runner Agent

**Purpose:** `npx playwright test`, interpret failures, offer **Retry Fix** handoff to Test Fixer for selector issues.  **Detail:** [test_runner/README.md](test_runner/README.md).



## Troubleshooting

- **Playwright browsers missing:** `npx playwright install` (see also [Reference commands](#reference-commands)).
- **Flaky tests:** re-run [Test Fixer](#test-fixer-agent) or adjust waits; try `npx playwright test --headed` to observe timing.
- **MCP or auth issues:** [README.md — MCP servers for Copilot agents](README.md#mcp-servers-for-copilot-agents) and agent-specific READMEs.

## Reference commands

```powershell
npm test
npm run test:headed
npx playwright test
npx playwright test --headed
```
