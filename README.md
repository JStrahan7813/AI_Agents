# Agents

Ready-made AI instructions for test automation, tooling setup, and related engineering workflows.  

The repository supports two stacks: **Visual Studio Code + GitHub Copilot** and **Cursor**, with different paths in this repository and separate official documentation.  

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
