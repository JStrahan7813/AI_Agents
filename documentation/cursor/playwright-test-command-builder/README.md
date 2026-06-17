# Playwright Test Command Builder: Cursor skill

## Overview

This Cursor skill builds Playwright terminal commands from plain-language requests and can optionally execute them when the user clearly asks to run tests. It is designed for repos where tests may live in nested folders and testers want fast, reusable `npx playwright test ...` commands.

## What this skill does

- Converts requests like *"run homepage and login tests in parallel"* into runnable Playwright commands
- Supports common flags such as `--workers`, `--headed`, `--debug`, `--project`, `-g`, `--trace`, `--retries`, and `--reporter`
- Handles multiple test targets in a single command
- Maintains session memory for:
  - run directory
  - last generated command
- Supports command file output when requested (default `playwright-commands.txt` at workspace/project root)
- Uses safe intent handling:
  - command-only request -> output command only
  - explicit run request -> show command, then execute
  - ambiguous request -> output command and ask for confirmation before execution

## Prerequisites

- **Cursor** with this skill available under **`.cursor/skills/playwright-test-command-builder/`**
- A Playwright project (TypeScript/Node) where `npx playwright test` is valid from the chosen run directory
- Skill definition file: **`.cursor/skills/playwright-test-command-builder/SKILL.md`**

## How to use this skill

### Skill file

- Keep the skill folder in `.cursor/skills/playwright-test-command-builder/` in the current workspace root, or copy it to a user skill location.

### Invoke in Cursor

- Use **Agent** chat with plain language, or type `/` and pick the skill. See [documentation/cursor/README.md](../README.md).

## Example prompts

- *"Give me a command to run homepage and login tests in parallel"*
- *"Run homepage tests"*
- *"Same command but headed"*
- *"Rerun last command with workers 1 and debug"*
- *"Save commands for 5 test files to playwright-commands.txt"*
- *"Run all tests in parallel from project root"*

## Notes

- Default run directory is `tests/`; if missing, the skill can fallback to project root for the session.
- Memory is session scoped (not guaranteed across new chats).
- For shell compatibility, prefer two-line commands when changing directory, or use shell-specific one-line separators (PowerShell `;`, bash/zsh `&&`).
- Full behavior and rules are defined in **`.cursor/skills/playwright-test-command-builder/SKILL.md`**; this README is a user-facing summary.
