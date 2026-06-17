# Pact Architect: Copilot agent

## Overview

This GitHub Copilot custom agent guides you through **Pact V3** contract testing with **`@pact-foundation/pact`**. It helps you add either a **consumer** test (expectations against a mock provider) or **provider verification** (checking your API against existing pact files), and generates TypeScript test code accordingly.

## What this agent does

- Asks whether you need a **consumer** test or **provider** verification
- For **consumer**: uses your **API client** code that performs HTTP calls
- For **provider**: uses your **OpenAPI** specification or **controller/handler** code as context
- Generates **TypeScript** tests (`.spec.ts`) using `PactV3`, `MatchersV3`, or `Verifier` as appropriate
- Ensures the consumer test wires the real client to **`mockServer.url`** so traffic hits the mock, not production

## Prerequisites

- **GitHub Copilot** in Visual Studio Code with custom agents available.
- **`test_pact.agent.md`** in **`.github/agents/`**.
- A **Node.js** project with **`@pact-foundation/pact`** available (or willingness to add it).
- For provider verification: a **running API** at a known base URL and path(s) to pact JSON files when applicable.

## How to use this agent

### Agent file

- Ensure **`test_pact.agent.md`** is in the **`.github/agents/`** folder.

### Select the agent in VS Code

- Open **GitHub Copilot Chat**, use the **agent** drop-down, and select this custom agent.

### Workflow context

*Use for **full-stack Pact** flows in TypeScript: consumer contract generation and provider verification, in parallel with or instead of provider-seeded consumer workflows.*

## Example prompts

- *"Create a Pact consumer test for my API client"*
- *"Add provider verification for our User API against the generated pacts"*
- *"Help me set up @pact-foundation/pact for GET /users/1"*

## Questions the agent may ask

| Question | Why |
|----------|-----|
| **Consumer or provider verification?** | Chooses `PactV3` interactions vs `Verifier`. |
| **Consumer name and provider name?** | Names embedded in pact files and verification config. |
| **Where is the client code or API definition?** | Grounds generated tests in your codebase. |

## What happens when you run it

The agent produces or updates TypeScript test files, uses matchers for robust expectations where appropriate, and explains how to run tests and locate generated pacts.

## Outputs

| Item | Purpose |
|------|---------|
| `.spec.ts` (consumer and/or provider) | Executable Pact V3 tests |
| Pact JSON (when consumer tests run) | Typically under a `pacts` directory in the project |

## Handoffs

*This agent does not define handoffs in its profile. After consumer tests pass, commit pact files and run **provider verification** in CI or locally as your pipeline requires.*

## Verification

- Run your test runner (e.g. `npx jest` or `npx vitest`) on the new spec.
- For consumer tests, confirm interactions appear under your configured pact output directory.
- For provider verification, confirm the API under test matches the referenced pact files.
