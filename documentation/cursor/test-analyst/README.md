# Test Analyst (BDD / Gherkin): Cursor skill

## Overview

This Cursor skill turns requirements or backlog items into Gherkin **`.feature`** files and saves them under **`./features/`**, using clear Given / When / Then structure. It pairs naturally with the **test-scripter** skill for Playwright drafts.

## What this skill does

- Accepts **requirements** from you or fetches from the backlog (e.g. Azure DevOps) when tools are available
- Asks whether to include **edge cases and negative scenarios**
- Converts requirements into a **Gherkin `.feature` file** with a meaningful name (e.g. `cookie-consent.feature`)
- Creates **`./features/`** if it does not exist and **saves** the file there
- Verifies the file by reading it back and reports the path
- Suggests using the **test-scripter** skill next to generate the draft Playwright test script

## Prerequisites

- **Cursor** with **`.cursor/skills/`** inside a workspace root.
- Skill definition: **`.cursor/skills/test-analyst/SKILL.md`**
- **Project skill:** `.cursor/skills/test-analyst/` in this repo, or **user skill:** copy the folder to `%USERPROFILE%\.cursor\skills\test-analyst\` (Windows) or `~/.cursor/skills/test-analyst/` (macOS/Linux).
- **Azure DevOps (optional):** if you use the Azure DevOps MCP, you can ask for work items by ID or query; otherwise paste requirement text.

## How to use this skill

### Skill file

- Keep **`SKILL.md`** under **`.cursor/skills/test-analyst/`**.

### Invoke in Cursor

- Use **Agent** chat and plain-language prompts, or **`/`** to pick the skill. See [documentation/cursor/README.md](../README.md).

### Workflow context

*Typically follows **test-setup** when you need a feature folder and conventions. Output feeds **test-scripter** for `.spec.ts` drafts.*

## Example prompts

- *"Create a feature file from PBI 67842"*
- *"Convert these requirements to Gherkin"*
- *"Write a `.feature` file for the login flow"*
- *"Create BDD scenarios from the acceptance criteria"*
- *"Turn this into Given/When/Then"*

**Azure DevOps:** With the MCP configured, you can reference work item IDs or queries; otherwise paste the requirement.

## Questions the skill may ask

| Question | Why |
|----------|-----|
| **What is the requirement or PBI?** | Source text or identifier for the feature file. |
| **Include edge cases and negative scenarios?** | Widens scenario coverage when you agree. |

## What happens when you run it

The `.feature` file is written under **`./features/`**, verified, and you are pointed toward **test-scripter** for the Playwright draft.

## Outputs

| Item | Purpose |
|------|---------|
| `./features/<name>.feature` | Gherkin feature file (Background, Scenario, Scenario Outline as needed) |

Filenames are kebab-case from the requirement title. Only the feature file is produced; no test code is written in this step.

## Handoffs

- **Draft Playwright tests** → **test-scripter** skill: use the generated `.feature` as input.

## Verification

- Open the `.feature` file and confirm scenarios match the source requirements and your team’s Gherkin conventions.
- The full instructions Cursor follows are in **`.cursor/skills/test-analyst/SKILL.md`** (this README is only a summary).
