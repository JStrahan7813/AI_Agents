# Story Architect: Cursor skill

## Overview

This Cursor skill reviews Azure DevOps work items (PBIs or user stories) for clarity, acceptance criteria quality, and testability. It fetches the item, produces a quality report and a revised description, and, only with your explicit consent, can update the work item in Azure DevOps.

## What this skill does

- Fetches and reads the specified **work item** (PBI or user story)
- Evaluates **clarity**, **value** (including “As a… I want… So that…” where applicable), **acceptance criteria**, **Gherkin-style clarity** where used, and **testability**
- Presents a **quality report** (gaps, ambiguities, missing negative scenarios, and similar)
- Drafts a **revised** description and acceptance criteria
- Asks whether to **update the work item**; updates only if you agree in the current turn

## Prerequisites

- **Cursor** with **`.cursor/skills/`** inside a workspace root.
- Skill definition: **`.cursor/skills/test-story-architect/SKILL.md`**
- **Project skill:** `.cursor/skills/test-story-architect/` in this repo, or **user skill:** copy the folder to `%USERPROFILE%\.cursor\skills\test-story-architect\` (Windows) or `~/.cursor/skills/test-story-architect/` (macOS/Linux).
- **Azure DevOps MCP** enabled and authenticated, with permission to read (and optionally update) work items.

## How to use this skill

### Skill file

- Keep **`SKILL.md`** under **`.cursor/skills/test-story-architect/`**.

### Invoke in Cursor

- Use **Agent** chat and plain-language prompts, or **`/`** to pick the skill. See [documentation/cursor/README.md](../README.md).

### Workflow context

*Runs **before** detailed BDD authoring: use it to get a work item to “Definition of Ready” quality, then use **test-analyst** for Gherkin feature files.*

## Example prompts

- *"Review work item 12345 for readiness"*
- *"Analyse this PBI's acceptance criteria and suggest improvements"*
- *"Is story 67890 testable enough for QA?"*

## Questions the skill may ask

| Question | Why |
|----------|-----|
| **Which work item ID (or query)?** | Identifies the PBI or story to fetch. |
| **Would you like me to update work item #[ID] with these improved details?** | Mandatory consent before any Azure DevOps write. |

It may also infer follow-up questions from gaps it finds (e.g. unclear success metrics).

## What happens when you run it

The work item is analysed, findings are reported, and a revised description and acceptance criteria are shown. You then choose whether to update Azure DevOps or copy the text manually.

## Outputs

| Item | Purpose |
|------|---------|
| Quality report in chat | Structured feedback on readiness |
| Revised description and AC | Ready to paste or apply via update |
| Optional work item update | Applied only after you explicitly agree |

## Handoffs

- **Create test scenarios** → **test-analyst** skill: when the description and acceptance criteria are refined and you want Gherkin feature files for the requirement.

## Verification

- Re-open the work item in Azure DevOps and confirm the description and acceptance criteria match what you approved.
- Check that negative paths and measurable outcomes are explicit enough for development and test planning.
- The full instructions Cursor follows are in **`.cursor/skills/test-story-architect/SKILL.md`** (this README is only a summary).
