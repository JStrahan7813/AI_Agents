# Agents

Ready-made AI instructions for test automation, tooling setup, and related engineering workflows.  

The repository supports two stacks: **Visual Studio Code + GitHub Copilot** and **Cursor**, with different paths in this repository and separate official documentation. 

## ⛓️ CI/CD Agent Orchestration Pipeline

This repository utilizes a multi-agent AI workforce running inside a GitHub Actions workflow (`.github/workflows/agent-pipeline.yml`). Instead of executing standalone tasks, the agents operate like an assembly line, where each agent acts as a specialized data transformer that passes its output downstream to the next step.

Please note it also includes Desktop Literacy Agent: A self-healing SDET bot that automates and optimizes Windows UI testing for desktop apps. It scans test files for fragile locators, inspects the live WinAppDriver/Appium XML DOM to automatically fix broken selectors, and handles multi-process desktop window switching seamlessly.
This was written by myself to address the need to have an AI Agent that dealt with the challenges of desktop automation. It is a prototype which was used to write a FLAUI agent which helped write tests in C# for native Windows desktop apps in later iterations.


### 📋 Detailed Step Breakdown

1. **Step 1: The Setup Agent (`test_setup.agent.md`)**
   Initializes structural constraints, API configurations, and target definitions, locking them safely inside `setup_config.json`.
   
2. **Step 2: The Runner Agent (`test_runner-agent.md`)**
   Ingests the setup configurations, analyzes the current repository environment, maps out user journey verification plans, and outputs them into `runner_plan.json`.

3. **Step 3: The Scripter Agent (`test_scripter.agent.md`)**
   Takes the structural execution plans and handles the heavy lifting of writing raw, functional E2E JavaScript code, outputting an unpolished initial script named `scripter_draft.spec.mjs`.

4. **Step 4: The Fixer Agent (`test_fixer.agent.md`)**
   Acts as an automated code reviewer. It opens the draft file, ensures it complies strictly with valid Playwright selector structures, adds resilient assertions, strips out conversational markdown text block delimiters, and compiles the final polished suite to `generated_test.spec.mjs`.

5. **Step 5: Playwright Native Verification**
   Dynamically provisions a single-worker, headless Chromium browser instance via an inline configuration script, executing the fully compiled test suite to verify the code runs successfully in a clean box.

### 🛡️ Built-in Pipeline Safeguards

* **State Isolation:** Agents never write directly over each other's live working file systems. If an intermediate step encounters an external API or quota rate limit (e.g., HTTP 429), the error is isolated to that specific phase.
* **Fail-Fast Mechanics:** The automation wrapper script (`execute-generic-agent.js`) in

## Table of contents

- [VS Code + GitHub Copilot and Cursor](#vs-code--github-copilot-and-cursor)
  - [Main folders by editor](#main-folders-by-editor)
- [Documentation and repository layout](#documentation-and-repository-layout)

## VS Code + GitHub Copilot and Cursor

The two products are **not** interchangeable: different editors, different AI entry points, and different folders in this repository.  

| | **Visual Studio Code + GitHub Copilot** | **Cursor** |
|---|----------------------------------------|------------------------|
| **What this repo provides** | [Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents) | [Skills](https://cursor.com/docs/skills) |
| **Where it runs** | [GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/overview) | Cursor **Agent** chat and rules UI |
| **Stack-specific guide** | [documentation/coPilot/README.md](documentation/coPilot/README.md) | [documentation/cursor/README.md](documentation/cursor/README.md) |

Naming trap: VS Code’s [Agent Skills for Copilot](https://code.visualstudio.com/docs/copilot/customization/agent-skills) are **not** the same as Cursor’s [Agent Skills](https://cursor.com/docs/context/skills) in `.cursor/skills/`.  

### Main folders by editor

GitHub Copilot and Cursor read instructions from different folders under this repository root.  The table is a quick map of path, stack, and purpose.  

| Path | Stack | Role |
|------|-------|------|
| [`.github/agents/`](.github/agents/) | **VS Code + GitHub Copilot** | `*.agent.md` definitions for the Copilot coding agent (see [Creating custom agents for Copilot coding agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)).  |
| [`.cursor/skills/`](.cursor/skills/) | **Cursor** | Skill folders (`SKILL.md`, YAML front matter, optional `references/` / `scripts/`).  Loaded by Cursor when the folder sits in an opened workspace root ([Cursor Agent Skills](https://cursor.com/docs/context/skills)).  Portable format: [agentskills.io](https://agentskills.io/).  |
| [`documentation/`](documentation/) | **Both** | Deeper guides: [`documentation/coPilot/README.md`](documentation/coPilot/README.md) (GitHub Copilot / VS Code) and [`documentation/cursor/README.md`](documentation/cursor/README.md) (Cursor).  |

**Agents repository vs application repository:** if your main code lives in a different Git checkout from this repo, you can still use **Copilot agent files** and **Cursor skill folders** from here; see [documentation/coPilot/README.md](documentation/coPilot/README.md#copilot-agent-files-with-another-repository) and [documentation/cursor/README.md](documentation/cursor/README.md#cursor-skill-folders-with-another-repository).  


High-level tree:

```
.github/
└── agents/

.cursor/
└── skills/

.vscode/

documentation/
├── coPilot/
└── cursor/
```
