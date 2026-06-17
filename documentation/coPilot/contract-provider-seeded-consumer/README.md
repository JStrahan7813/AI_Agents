# Contract provider-seeded consumer (Pact): Copilot agent

## Overview

This GitHub Copilot custom agent helps **provider** teams generate **consumer-side** Pact contracts and tests when no real consumer application exists yet. It scans provider code for routes, agrees scenarios with you, then emits Pact consumer tests (and optionally a small HTTP client wrapper). It does **not** generate provider verification tests.

## What this agent does

- Discovers API surface from provider source (routes, controllers, minimal APIs)
- Runs a **structured questionnaire** (phases) before any code generation
- Builds a **scenario matrix** per endpoint (happy paths, errors, domain dimensions)
- Generates **consumer Pact tests** (PactNet for C# or Pact-JS for JavaScript/TypeScript, per your choices)
- Optionally scaffolds or uses an existing **client wrapper** aligned with how consumers would call the API
- Summarises coverage and how real consumers can adopt or refine the contracts

## Prerequisites

- **GitHub Copilot** in Visual Studio Code with custom agents available.
- **`contract-provider-seeded-consumer.md`** in **`.github/agents/`**.
- You are working in the **provider** repository (the API implementation).
- **.NET SDK** and/or **Node.js** as needed for the languages you choose for consumer tests.

## How to use this agent

### Agent file

- Ensure **`contract-provider-seeded-consumer.md`** is in the **`.github/agents/`** folder.

### Select the agent in VS Code

- Open **GitHub Copilot Chat**, use the **agent** drop-down, and select this custom agent.

### Workflow context

*Use when you need **provider-seeded** consumer contracts; for example before a separate consumer repo exists, or to bootstrap contract tests from the API codebase. For standard consumer-driven tests from an existing client, your team may prefer a different Pact-focused agent.*

## Example prompts

- *"Create consumer-side Pact contracts from this provider repo"*
- *"Seed Pact consumer tests for our REST API"*
- *"I need provider-seeded Pact tests in C#"*

## Questions the agent may ask

The agent **must** complete its interactive phases before generating code. In brief:

| Phase | Topics |
|-------|--------|
| **1. Context and technology** | Provider repo confirmation, consumer-only scope, provider/consumer language pair, consumer test framework (xUnit/NUnit/MSTest or Jest/Mocha), .NET target framework check where relevant |
| **2. Provider surface** | API entrypoints, automated route discovery, which endpoints to include (typically 1-5 initially) |
| **3. Scenarios** | Happy paths, non-2xx behaviour, error payload shape, domain dimensions (e.g. locale), matrix confirmation |
| **4. Consumer behaviour and data** | Existing client wrapper path or scaffold, observable outcomes per scenario, synthetic/neutral example values (no secrets or PII) |

Further detail lives in the agent definition in **`.github/agents/contract-provider-seeded-consumer.md`**.

## What happens when you run it

After your answers, the agent generates consumer Pact tests (and optional wrapper code), aligned with the agreed matrix and matchers. It reviews coverage and may suggest follow-up work.

## Outputs

| Item | Purpose |
|------|---------|
| Consumer Pact test project / files | Contract expectations and executable tests |
| Optional HTTP client wrapper | Thin layer used by tests if none existed |
| Chat summary | Endpoints covered, scenarios, and adoption notes |

## Handoffs

*This agent does not define handoffs in its profile. After contracts exist, your team typically publishes pacts to a broker (if used) and runs **provider verification** in your API pipeline.*

## Verification

- Run the generated consumer test suite locally (e.g. `dotnet test` or `npm test` as appropriate).
- Confirm Pact artefacts are written to the expected output directory (e.g. `pacts`).
