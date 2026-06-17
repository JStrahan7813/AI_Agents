# Cursor: usage guide

This repository includes **Cursor skills**: folders under `.cursor/skills/` that contain instructions Cursor’s **Agent** chat can use. You describe what you want in everyday language; Cursor picks a matching skill when it fits.

The sections below walk through opening this repo in Cursor, using skills when your **application** lives in a **different** Git checkout, and enabling **MCP** (Model Context Protocol) only when a skill needs extra tools, such as controlling a browser or reading Azure DevOps work items. 

If you are new here, read the root [README.md](../../README.md) first, it explains how this **Agents** repository and your app project fit together.

## Table of contents

- [Using and invoking Cursor skills](#using-and-invoking-cursor-skills)
- [Cursor skill folders with another repository](#cursor-skill-folders-with-another-repository)
- [Documented skills](#documented-skills)
  - [Prerequisites](#prerequisites)
  - [Suggested workflow](#suggested-workflow)
- [MCP servers for Cursor skills](#mcp-servers-for-cursor-skills)
- [Official documentation (Cursor)](#official-documentation-cursor)

---

## Using and invoking Cursor skills

*Cursor only; not VS Code.*

1. **Workspace:** open this repository (or add it to a workspace) so `.cursor/skills/` lies inside an opened root folder.  If your main code is in another checkout, see [Cursor skill folders with another repository](#cursor-skill-folders-with-another-repository).
2. **Discovery:** **Settings → Rules → Agent Decides** lists discovered skills ([viewing skills](https://cursor.com/docs/context/skills)).
3. **Invocation:** use **Agent** chat (so agent behaviour and skills apply).  Describe the task in plain language so Cursor matches a skill’s `description`, or type `/` and pick a skill.

Skill names, triggers, typical order, and doc links: [Documented skills](#documented-skills).  **MCP** (browser and optional backlog): [MCP servers for Cursor skills](#mcp-servers-for-cursor-skills).

## Cursor skill folders with another repository

Scenario: the **Application repository** (your application or other project) is a different Git checkout from this **Agents repository**, but you still want **Cursor skill folders** from here in Cursor while you work there.

**GitHub Copilot** custom agents (`*.agent.md`) use a different path and options; everything for that stack is in [documentation/coPilot/README.md](../coPilot/README.md#copilot-agent-files-with-another-repository).

### Terms used in this section

| Term | Meaning |
|------|---------|
| **Agents repository** | This Git project: the local folder checked out from the repo that contains the root `README.md`. |
| **Application repository** | The other project’s Git checkout (the codebase under day-to-day work). |
| **Cursor skill folders** | Subfolders of `.cursor/skills/` that each contain `SKILL.md`. |

### Patterns

1. **Multi-root** ([A](#a-multi-root-workspace-cursor)): add both checkouts as workspace roots ([multi-root workspaces](https://code.visualstudio.com/docs/editor/workspaces#_multi-root-workspaces)); Cursor loads `.cursor/skills/` from any root that contains it.
2. **Copy** ([B](#b-copy-skills-into-the-other-repository-cursor)): copy skill folders into the **Application repository** when you need a single-folder workflow, CI, or committed skills.

| Option | Section | When it helps |
|--------|-------|----------------|
| Multi-root: **Agents repository** + **Application repository** | [A](#a-multi-root-workspace-cursor) | One window, two checkouts; skills from the **Agents repository** root apply while editing the app. |
| Copy skill folders into the **Application repository** | [B](#b-copy-skills-into-the-other-repository-cursor) | Skills live beside application code in Git. |
| User-level skills on the machine | [C](#c-user-level-skills-cursor) | Many repos or personal use without copying into each checkout. |

**Why skills “vanish”:** Cursor only loads folders that are workspace roots (or user-level paths).  If the **Agents repository** is not a root, its `.cursor/skills/` is out of scope until [A](#a-multi-root-workspace-cursor), [B](#b-copy-skills-into-the-other-repository-cursor), or [C](#c-user-level-skills-cursor) fixes that.

### A. Multi-root workspace (Cursor)

Same workspace model as Visual Studio Code ([VS Code multi-root docs](https://code.visualstudio.com/docs/editor/workspaces#_multi-root-workspaces)).  Copilot-specific notes: [documentation/coPilot/README.md](../coPilot/README.md#option-1-multi-root-workspace).

**File → Add Folder to Workspace…**, then add folders; optionally **Save Workspace As** a `.code-workspace` file.

1. Add the **Agents repository** and **Application repository** checkout folders as two roots.
2. Save the workspace if you reopen this layout often.

Each root that contains `.cursor/skills/` contributes those skills, so the **Agents repository** checkout can supply skills while you edit files under the application root.

### B. Copy skills into the other repository (Cursor)

1. In the **Application repository** checkout, create `.cursor/skills/` if missing.
2. From the **Agents repository** checkout, copy entire skill folders (e.g. `.cursor/skills/test-setup/`, including `SKILL.md` and subfolders).
3. Commit and push if the team should share them.
4. Reload the window; confirm skills under **Settings → Rules → Agent Decides** ([Using and invoking Cursor skills](#using-and-invoking-cursor-skills)).

### C. User-level skills (Cursor)

1. Copy a skill folder to `~/.cursor/skills/<skill-name>/` (macOS/Linux) or `%USERPROFILE%\.cursor\skills\<skill-name>\` (Windows).
2. Restart Cursor or reload if skills do not appear.

Use this when you open many repositories and do not want per-repo copies.  This path does **not** apply to **Copilot agent files**; for those see [documentation/coPilot/README.md](../coPilot/README.md#option-2-copy-agent-files).

---

## Documented skills

Each skill is defined under `.cursor/skills/<name>/` (`SKILL.md`). The **Doc** column links to the human README under `documentation/cursor/<name>/` in this folder. **MCP:** see [MCP servers for Cursor skills](#mcp-servers-for-cursor-skills). **playwright-best-practices**: the doc here is a short pointer; full human copy lives beside `SKILL.md` under `.cursor/skills/playwright-best-practices/`.  **test-setup (Cursor vs Copilot):** this Cursor skill seeds browser coverage and Cobertura; the Copilot **Test Setup** agent in [documentation/coPilot/test-setup/README.md](../coPilot/test-setup/README.md) follows a different agent file and stack; see [test-setup/README.md](test-setup/README.md#cursor-vs-copilot-test-setup).

| Skill | Trigger examples | Doc |
|-------|------------------|-----|
| **test-setup** | “Create a Playwright test environment”, “Set up Playwright tests” | [test-setup/README.md](test-setup/README.md) |
| **playwright-template-deploy** | “Deploy the Playwright template”, “Clone Playwright_automation_template”, “Install the Everway Playwright template” | [playwright-template-deploy/README.md](playwright-template-deploy/README.md) |
| **test-analyst** | “Create a feature file from PBI 67842”, “Convert requirements to Gherkin” | [test-analyst/README.md](test-analyst/README.md) |
| **test-scripter** | “Write a Playwright test from this feature file”, “Draft test code from acceptance criteria” | [test-scripter/README.md](test-scripter/README.md) |
| **test-run-and-fix** | “Run the Playwright tests”, “Fix the GUESS selectors”, “Why did my test fail?” | [test-run-and-fix/README.md](test-run-and-fix/README.md) |
| **test-axe-accessibility** | “Create an accessibility test for the page body”, “Set up axe-core a11y testing”, “Accessibility test for the header” | [test-axe-accessibility/README.md](test-axe-accessibility/README.md) |
| **test-story-architect** | “Review work item 12345 for readiness”, “Analyse this PBI’s acceptance criteria”, “Is this story testable enough for QA?” | [test-story-architect/README.md](test-story-architect/README.md) |
| **contract-provider-seeded-consumer** | “Create consumer-side Pact contracts from this provider repo”, “Seed Pact consumer tests for our REST API”, “Provider-seeded Pact tests in C#” | [contract-provider-seeded-consumer/README.md](contract-provider-seeded-consumer/README.md) |
| **playwright-best-practices** | “Follow Playwright best practices”, “Debug a flaky E2E test”, “Improve our Playwright test structure” | [playwright-best-practices/README.md](playwright-best-practices/README.md) |
| **playwright-test-command-builder** | “Give me a command to run homepage tests”, “Run homepage and login tests in parallel”, “Save Playwright commands to file” | [playwright-test-command-builder/README.md](playwright-test-command-builder/README.md) |

## Prerequisites

- Node.js (LTS) and npm (core Playwright flow).
- **.NET SDK** and/or **Node.js** when using **contract-provider-seeded-consumer** for the languages you choose.
- [MCP servers for Cursor skills](#mcp-servers-for-cursor-skills) when you rely on **test-run-and-fix** self-heal, **test-axe-accessibility** selector discovery, or optional Azure backlog fetch (**test-analyst** / **test-story-architect**).

## Suggested workflow

**Playwright pipeline (typical):**

1. **playwright-template-deploy** *or* **test-setup**: environment.  Use **playwright-template-deploy** to clone the official Everway template (`config/` + `.env`); use **test-setup** for a lightweight scaffold (`agent-config.json`, `./E2E`).  Pick one, not both.
2. **test-story-architect**: (Optional) refine the PBI or story in Azure DevOps before BDD.
3. **test-analyst**: `.feature` from requirements or a PBI.
4. **test-scripter**: draft `.spec.ts` and helpers (selectors may be `// GUESS`).
5. **test-run-and-fix**: run tests; fix selectors with Playwright MCP when needed.
6. **test-axe-accessibility**: (Optional) a11y tests and markdown reports after **test-setup** or **playwright-template-deploy**.

**Outside that line:** use **contract-provider-seeded-consumer** for provider-seeded Pact consumer tests, and **playwright-best-practices** whenever you want broad Playwright guidance in any repo.

You can run skills out of order; the agent often suggests a next step.

---

## MCP servers for Cursor skills

Skills under [`.cursor/skills/`](../../.cursor/skills/) are Markdown instructions; some expect **MCP** tools in Cursor (browser, backlog APIs).

### Enable MCP in Cursor

1. **Cursor Settings** → **MCP** (or **Features → MCP**).
2. Add servers per [Cursor’s MCP documentation](https://cursor.com/docs/context/mcp).
3. Use **Agent** chat for skills that call MCP tools; confirm the server is connected first.

### Playwright MCP (browser)

Used so the agent can navigate and inspect the live DOM (selector self-heal and a11y selector discovery).

| Skill | When Playwright MCP matters |
|-------|-----------------------------|
| **test-run-and-fix** | **Needed** for the self-heal path (`// GUESS`, failed selectors).  Terminal `npx playwright test` alone does not require it. |
| **test-axe-accessibility** | **Needed** for new a11y tests when selectors must be discovered from the page (navigate + snapshot). |

Tool names vary by server (`browser_*`, `playwright_*`, etc.).  Install the Playwright MCP server from Cursor’s UI or the server’s README; ensure the app is reachable (e.g. `agent-config.json` `baseUrl`).

### Azure DevOps MCP (optional)

| Skill | Use |
|-------|-----|
| **test-analyst**, **test-story-architect** | Optional backlog / work-item fetch when the server is enabled; otherwise paste requirements manually. |

### Other skills

**test-setup**, **playwright-template-deploy**, **test-scripter**, **playwright-best-practices**, and **contract-provider-seeded-consumer** do not require MCP for the workflows described in their `SKILL.md` files.

---

## Official documentation (Cursor)

- [Agent Skills | Cursor Docs](https://cursor.com/docs/context/skills)
- [Agent Skills (open standard)](https://agentskills.io/)

No Cursor-produced **Agent Skills** tutorial video is linked here; prefer the docs above.