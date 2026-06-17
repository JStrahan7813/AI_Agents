# Contract provider-seeded consumer (Pact): Cursor skill

## Overview

This Cursor skill helps **provider** teams generate **consumer-side** Pact contracts and tests when no real consumer application exists yet. It scans provider code for routes, agrees scenarios with you, then emits Pact consumer tests (and optionally a small HTTP client wrapper). It does **not** generate provider verification tests.

## What this skill does

- Discovers API surface from provider source (routes, controllers, minimal APIs)
- Runs a **structured questionnaire** (phases) before any code generation
- Builds a **scenario matrix** per endpoint (happy paths, errors, domain dimensions)
- Generates **consumer Pact tests** (PactNet for C# or Pact-JS for JavaScript/TypeScript, per your choices)
- Optionally scaffolds or uses an existing **client wrapper** aligned with how consumers would call the API
- Summarises coverage and how real consumers can adopt or refine the contracts

## Prerequisites

- **Cursor** with **`.cursor/skills/`** inside a workspace root.
- Skill definition: **`.cursor/skills/contract-provider-seeded-consumer/SKILL.md`**
- **Project skill:** `.cursor/skills/contract-provider-seeded-consumer/` in this repo, or **user skill:** copy the folder to `%USERPROFILE%\.cursor\skills\contract-provider-seeded-consumer\` (Windows) or `~/.cursor/skills/contract-provider-seeded-consumer/` (macOS/Linux).
- You are working in the **provider** repository (the API implementation).
- **.NET SDK** and/or **Node.js** as needed for the languages you choose for consumer tests.

## How to use this skill

### Skill file

- Keep **`SKILL.md`** under **`.cursor/skills/contract-provider-seeded-consumer/`**.

### Invoke in Cursor

- Use **Agent** chat and plain-language prompts, or **`/`** to pick the skill. See [documentation/cursor/README.md](../README.md).

### Workflow context

*Use when you need **provider-seeded** consumer contracts; for example before a separate consumer repo exists, or to bootstrap contract tests from the API codebase.*

## Example prompts

- *"Create consumer-side Pact contracts from this provider repo"*
- *"Seed Pact consumer tests for our REST API"*
- *"I need provider-seeded Pact tests in C#"*

## Questions the skill may ask

The skill **must** complete its interactive phases before generating code. In brief:

| Phase | Topics |
|-------|--------|
| **1. Context and technology** | Provider repo confirmation, consumer-only scope, provider/consumer language pair, consumer test framework (xUnit/NUnit/MSTest or Jest/Mocha), .NET target framework check where relevant |
| **2. Provider surface** | API entrypoints, automated route discovery, which endpoints to include (typically 1-5 initially) |
| **3. Scenarios** | Happy paths, non-2xx behaviour, error payload shape, domain dimensions (e.g. locale), matrix confirmation |
| **4. Consumer behaviour and data** | Existing client wrapper path or scaffold, observable outcomes per scenario, synthetic/neutral example values (no secrets or PII) |

Further detail is in **`.cursor/skills/contract-provider-seeded-consumer/SKILL.md`**.

## What happens when you run it

After your answers, consumer Pact tests (and optional wrapper code) are generated, aligned with the agreed matrix and matchers. You get a coverage summary and suggested follow-up work.

## Outputs

| Item | Purpose |
|------|---------|
| Consumer Pact test project / files | Contract expectations and executable tests |
| Optional HTTP client wrapper | Thin layer used by tests if none existed |
| Chat summary | Endpoints covered, scenarios, and adoption notes |

## Handoffs

*This skill does not define formal handoffs. After contracts exist, your team typically publishes pacts to a broker (if used) and runs **provider verification** in your API pipeline.*

## Verification

- Run the generated consumer test suite locally (e.g. `dotnet test` or `npm test` as appropriate).
- Confirm Pact artefacts are written to the expected output directory (e.g. `pacts`).
- The full instructions Cursor follows are in **`.cursor/skills/contract-provider-seeded-consumer/SKILL.md`** (this README is only a summary).
