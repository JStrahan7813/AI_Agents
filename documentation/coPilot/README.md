# GitHub Copilot (Visual Studio Code): usage guide

This guide covers **custom Copilot agent files** (`.github/agents/*.agent.md`) in this repository: using them here, using them alongside an **Application repository**, **MCP** setup when those files declare MCP-backed **`tools:`**, opening chat, and official references.

## Table of contents

- [Using Copilot agent files in this repository](#using-copilot-agent-files-in-this-repository)
- [Copilot agent files with another repository](#copilot-agent-files-with-another-repository)
- [MCP servers for Copilot agents](#mcp-servers-for-copilot-agents)
- [Invoking custom agents in VS Code](#invoking-custom-agents-in-vs-code)
- [Official documentation](#official-documentation)
- [Further reading in this folder](#further-reading-in-this-folder)

## Using Copilot agent files in this repository

*Applies to Visual Studio Code with GitHub Copilot (Chat and coding agent).*

Definitions: [`.github/agents/`](../../.github/agents/) as `*.agent.md`.  Behaviour in the editor follows Microsoft’s guide: [Creating custom agents for Copilot coding agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents).

Prompts, inputs, outputs, and workflow: [General_Description.md](General_Description.md) and the per-feature READMEs linked under [Further reading in this folder](#further-reading-in-this-folder).

---

## Copilot agent files with another repository

Scenario: the **Application repository** (your application or other project) is a different Git checkout from this **Agents repository**, but you still want **Copilot agent files** from here available in VS Code while you work there.

### Terms used in this section

| Term | Meaning |
|------|---------|
| **Agents repository** | This Git project: the local folder checked out from the repo that contains the root `README.md`. |
| **Application repository** | The other project’s Git checkout (the codebase under day-to-day work). |
| **Copilot agent files** | `*.agent.md` files under `.github/agents/` inside a checkout. |

### Patterns

1. [Multi-root workspace](#option-1-multi-root-workspace): add two workspace roots: the checkout of the **Agents repository** and the checkout of the **Application repository** ([multi-root workspaces](https://code.visualstudio.com/docs/editor/workspaces#_multi-root-workspaces)).  No copy is required if GitHub Copilot picks up `.github/agents/` from the **Agents repository** root (see [option 1](#option-1-multi-root-workspace) below).
2. Copy into the **Application repository**: copy **Copilot agent files** ([option 2](#option-2-copy-agent-files)) into that checkout so they live beside that repo in Git; useful for a single-folder workflow, CI, or predictable paths.

### How to choose

- Start with multi-root ([option 1](#option-1-multi-root-workspace)) if both checkouts are on disk and opening both in one window is fine.  Nothing is copied; files stay in the **Agents repository** until something forces a copy.
- Copy **Copilot agent files** into the **Application repository** ([option 2](#option-2-copy-agent-files)) if only that checkout is opened day to day, policy or CI requires agent files in that repo, or after trying [option 1](#option-1-multi-root-workspace) GitHub Copilot still does not list the custom agents.

| Option | Section | When it helps |
|--------|---------|----------------|
| Multi-root: **Agents repository** + **Application repository** | [Option 1](#option-1-multi-root-workspace) | One window, two checkouts.  Copilot agent files stay under `.github/agents/` in the **Agents repository** checkout.  Confirm in GitHub Copilot that custom agents appear for your VS Code / GitHub Copilot version. |
| Copy `*.agent.md` into the **Application repository** | [Option 2](#option-2-copy-agent-files) | Single checkout workflow, CI, or agent files not picked up from the **Agents repository** root. |

**Why agents “vanish”:** if the **Agents repository** checkout is never added as a workspace root, VS Code does not load that folder.  Nothing from `.github/agents/` there is in scope until [option 1](#option-1-multi-root-workspace) adds the checkout, or [option 2](#option-2-copy-agent-files) puts copies where the **Application repository** checkout can see them.

### Option 1: Multi-root workspace

Multi-root workspaces are a Visual Studio Code feature ([documentation](https://code.visualstudio.com/docs/editor/workspaces#_multi-root-workspaces)).

In VS Code: **File → Add Folder to Workspace…**, then add folders; optionally **Save Workspace As** a `.code-workspace` file to reopen later.

1. Add the checkout folder of the **Agents repository** and the checkout folder of the **Application repository** as two roots in the same workspace.
2. Save the workspace if the same layout should be reopened often.

**Visual Studio Code + GitHub Copilot:** the path `.github/agents/` inside the **Agents repository** checkout is still on disk in the workspace.  Whether **GitHub Copilot** lists those custom agent files when most editing happens under the application checkout can depend on version and settings; if they do not appear, use [option 2](#option-2-copy-agent-files) to copy `*.agent.md` files into the **Application repository**’s `.github/agents/`.

### Option 2: Copy agent files

Guide: [Creating custom agents for Copilot coding agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents).

1. In the **Application repository** checkout, ensure `.github/agents/` exists.
2. Copy the required `*.agent.md` files from the **Agents repository** checkout into that folder.
3. Enable and run the agents in Visual Studio Code using the guide above.

---

## MCP servers for Copilot agents

**MCP** lets Copilot use **extra tools** that are not built into the editor by default; for example controlling a browser to inspect a page, or talking to Azure DevOps to read a work item.

Those files live under [`.github/agents/`](../../.github/agents/).  If a file’s YAML header lists **`tools:`**, Copilot needs the right **MCP servers** turned on in VS Code for those entries to work.  Background (workflow, prerequisites): [General_Description.md](General_Description.md).  **Below:** how to add those servers in VS Code.

### MCP servers referenced in `.github/agents/`

These match `tools:` patterns that appear in this repository’s `.github/agents/` files (see [General_Description.md](General_Description.md) for which files use them and when pasted input can substitute):

| Kind | Typical `tools:` pattern | Role |
|------|--------------------------|------|
| **Playwright (browser)** | `playwright/*` and/or `your-server-id/playwright_*` | Browser automation for live DOM inspection; install a server whose tools match the names in the agent file YAML (e.g. navigate/evaluate). |
| **Azure DevOps** | `ado/*` (e.g. `ado/wit_get_work_item`, `ado/search_workitem`) | Work-item and backlog APIs; tool names must match what the MCP server exposes. |

Shipped agent files whose `tools:` lists only built-in-style capabilities (execute, read, edit, search, filesystem helpers, etc.) do **not** need extra MCP servers for those entries.

### VS Code: install and configure MCP

Official overview: [Use MCP servers in VS Code | VS Code Docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers).  Full schema: [MCP configuration reference](https://code.visualstudio.com/docs/copilot/reference/mcp-configuration).

**1. Open where MCP is configured**

- **Workspace (team-friendly):** add or edit **`.vscode/mcp.json`** in the folder you opened in VS Code (for example the **Application repository** or a multi-root workspace root).  Commit it if the team should share the same servers.
- **User-wide:** Command Palette (**Ctrl+Shift+P** / **⇧⌘P**) → **MCP: Open User Configuration**.
- **Guided add:** Command Palette → **MCP: Add Server** (choose workspace vs global).

**2. Playwright MCP**

- **From the gallery:** Extensions view (**Ctrl+Shift+X**) → search **`@mcp playwright`** → install (user or **Install in Workspace** so `.vscode/mcp.json` is updated).
- **Manual `mcp.json` example** (same pattern as VS Code docs): a server entry whose tools appear as **`playwright/*`** in chat when the server id is `playwright`, for example:

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@microsoft/mcp-server-playwright"]
    }
  }
}
```

- After install or edit, trust/start the server when prompted.  Use **MCP: List Servers** to confirm it is running.

**3. Azure DevOps MCP**

- Install an **Azure DevOps** MCP server that exposes work-item tools compatible with the `ado/…` entries in whichever `*.agent.md` files you use (search **`@mcp`** in Extensions for Azure DevOps, or follow Microsoft’s [Azure MCP Server + VS Code](https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/get-started/tools/visual-studio-code) and the [Azure DevOps MCP](https://github.com/mcp/microsoft/azure-devops-mcp) registry entry).
- First use usually opens a **browser sign-in** to Azure DevOps ([General_Description.md](General_Description.md#prerequisites)).
- If you skip this server, some agent files that list `ado/*` can still be driven from pasted backlog or requirement text; see [General_Description.md](General_Description.md).

**4. Verify in VS Code**

- Extensions view → **MCP SERVERS - INSTALLED** → confirm Playwright and (if needed) Azure DevOps are enabled.
- Open **Copilot Chat** → **Configure Tools** (in the chat input) and confirm tools your selected custom agent needs are listed.
- Optional: send a small prompt that should trigger an MCP tool; approve the tool call if prompted.
- If a server fails, use **MCP: List Servers** → **Show Output** (see [Troubleshoot](https://code.visualstudio.com/docs/copilot/chat/mcp-servers#_troubleshoot-and-debug-mcp-servers) in the VS Code doc).

---

## Invoking custom agents in VS Code

Opening chat alone does **not** pick a custom agent; you choose the agent in the Chat view, then send your prompt.

- **Open Copilot Chat:** From the **Command Center** in the title bar (chat icon).  If the icon is missing, right-click the title bar and enable **Command Center**.  For Quick chat, inline chat, and shortcuts, see [Official documentation](#official-documentation).
- **Choose the custom agent:** In the **Chat** view, open the **agent** dropdown (agent picker) and select your custom agent.  VS Code then prepends the body of that `*.agent.md` file to your message for that conversation. 

---

## Official documentation

**Visual Studio Code + GitHub Copilot**

- [Using GitHub Copilot Chat in your IDE | GitHub Docs](https://docs.github.com/en/copilot/github-copilot-chat/copilot-chat-in-ides/using-github-copilot-chat-in-your-ide?tool=vscode) (opening chat, Quick chat, inline chat)
- [Custom agents in VS Code | VS Code Docs](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Chat customisations overview | VS Code Docs](https://code.visualstudio.com/docs/copilot/customization/overview) (Command Palette: **Chat: Open Chat Customizations**)
- [Creating custom agents for Copilot coding agent | GitHub Docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)
- [Use Agent Skills in VS Code | VS Code Docs](https://code.visualstudio.com/docs/copilot/customization/agent-skills) (Copilot agent skills in VS Code)
- [Use MCP servers in VS Code | VS Code Docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
- [Extending GitHub Copilot coding agent with MCP | GitHub Docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp)

**Workspaces**

- [Multi-root workspaces | VS Code](https://code.visualstudio.com/docs/editor/workspaces#_multi-root-workspaces)

**Supplementary videos**

Official documentation and product UI remain the source of truth; videos can go out of date.

- [VS Code tips: Multi-root workspaces](https://www.youtube.com/watch?v=2yOQUtP_GcY) (short demo; video description links Microsoft’s [multi-root workspaces](https://code.visualstudio.com/docs/editor/workspaces#_multi-root-workspaces) documentation)
- [How to get the most out of the Copilot coding agent](https://www.youtube.com/watch?v=GPML5a2jZCY) (GitHub; coding agent overview)

---

## Further reading in this folder

- [General_Description.md](General_Description.md): overview, orchestration, MCP, workflow, troubleshooting.
- Per-feature READMEs under `documentation/coPilot/`
