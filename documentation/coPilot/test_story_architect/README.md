# Story Architect: Copilot agent

## Overview

This GitHub Copilot custom agent reviews Azure DevOps work items (PBIs or user stories) for clarity, acceptance criteria quality, and testability. It fetches the item, produces a quality report and a revised description, and, only with your explicit consent, can update the work item in Azure DevOps.

## What this agent does

- Fetches and reads the specified **work item** (PBI or user story)
- Evaluates **clarity**, **value** (including “As a… I want… So that…” where applicable), **acceptance criteria**, **Gherkin-style clarity** where used, and **testability**
- Presents a **quality report** (gaps, ambiguities, missing negative scenarios, and similar)
- Drafts a **revised** description and acceptance criteria
- Asks whether to **update the work item**; updates only if you agree in the current turn

## Prerequisites

- **GitHub Copilot** in Visual Studio Code with custom agents available.
- **`test_story_architect.agent.md`** in **`.github/agents/`**.
- **Azure DevOps MCP** enabled and authenticated, with permission to read (and optionally update) work items.

## How to use this agent

### Agent file

- Ensure **`test_story_architect.agent.md`** is in the **`.github/agents/`** folder.

### Select the agent in VS Code

- Open **GitHub Copilot Chat**, use the **agent** drop-down, and select this custom agent.

### Workflow context

*Runs **before** detailed BDD authoring: use it to get a work item to “Definition of Ready” quality, then hand off to **Test Analyst** for Gherkin feature files.*

## Example prompts

- *"Review work item 12345 for readiness"*
- *"Analyse this PBI's acceptance criteria and suggest improvements"*
- *"Is story 67890 testable enough for QA?"*

## Questions the agent may ask

| Question | Why |
|----------|-----|
| **Which work item ID (or query)?** | Identifies the PBI or story to fetch. |
| **Would you like me to update work item #[ID] with these improved details?** | Mandatory consent before any Azure DevOps write. |

It may also infer follow-up questions from gaps it finds (e.g. unclear success metrics).

## What happens when you run it

The agent analyses the item, reports findings, shows a revised description and acceptance criteria, then waits for your decision on updating Azure DevOps or copying the text manually.

## Outputs

| Item | Purpose |
|------|---------|
| Quality report in chat | Structured feedback on readiness |
| Revised description and AC | Ready to paste or apply via update |
| Optional work item update | Applied only after you explicitly agree |

## Handoffs

- **Create Test Scenarios** → **Test Analyst**: when the description and acceptance criteria are refined and you want Gherkin feature files generated for the requirement.

## Verification

- Re-open the work item in Azure DevOps and confirm the description and acceptance criteria match what you approved.
- Check that negative paths and measurable outcomes are explicit enough for development and test planning.
