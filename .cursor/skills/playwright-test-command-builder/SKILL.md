---
name: playwright-test-command-builder
description: Builds ready-to-run Playwright terminal commands and optionally executes them based on user intent. Use when the user asks for `npx playwright test` commands, asks to run Playwright tests, or wants flags such as headed, workers, project, grep, debug, trace, retries, or reporter.
disable-model-invocation: true
---

# Playwright Test Command Builder

Generate copy-pasteable `npx playwright test ...` commands so QA testers can run tests quickly from terminal, even when specs live in nested directories.

## Use This Skill When

- The user asks for a Playwright run command.
- The user wants command variants (`headed`, parallel/workers, debug, project, grep, trace, retries, reporter).
- The user is unsure where the spec file sits in nested folders.

## Workflow

1. Collect run intent in this order:
   - Intent mode: command-only vs execute-now.
   - Run directory: default `tests/`, or user override (project root/custom folder).
   - Target type: all tests, folder, file, glob pattern, test title (`-g`), or tag pattern.
   - Runtime options: headed/headless, workers, project, retries, trace, reporter, debug, UI mode.
   - Whether a single final command is enough or multiple options are wanted.
2. Maintain run-directory memory.
   - Remember the latest run directory the user requested.
   - Keep using it until the user changes it or asks to reset to default.
   - If default `tests/` does not exist, use project root for this session and note the fallback.
3. Maintain recent-command memory.
   - Remember the last command this skill produced.
   - Support follow-up edits like "same command but headed", "rerun last with workers 1", or "last command plus debug".
4. Default behavior: best-guess-first.
   - Build the command immediately from available information.
   - If important details are missing, include a short assumptions note and optional variant(s).
5. If test location is unclear, discover likely spec paths recursively.
   - Prefer `Glob` to find `*.spec.ts`, `*.test.ts`, and `*.e2e.ts`.
   - Match likely names from the user request (for example `homepage`, `login`).
   - Present short relative paths so the user can choose when confidence is low.
   - If no matches are found, return nearest candidate paths and ask the user to pick one.
6. Build command(s) with only requested flags plus defaults from this skill.
   - When directory change is needed, prefer shell-safe output:
     - Two-line format (default): `cd <run-directory>` then `npx playwright test ...`
     - Single-line only when needed, using shell-appropriate separators.
7. If the user asks to save commands, write them to a command file.
   - Default file path: `playwright-commands.txt` (project root).
   - If user provides a path or filename, use that instead.
   - Default write mode is overwrite; append only when the user explicitly asks to append.
8. Return commands in a compact, copy-pasteable format.

## Intent Mode Rules (Key Behavior)

- `command-only` mode:
  - Trigger when user asks for wording like "give me a command", "what command should I run", "show me the command".
  - Output command text only. Do not execute.
- `execute-now` mode:
  - Trigger when user directly asks to run, for example "run homepage tests", "run these tests", "execute playwright tests".
  - Treat this as permission to execute generated command(s).
  - Before execution, always show the command briefly, then execute.
- If intent is ambiguous, default to safe behavior:
  - output the command first
  - ask: "Do you want me to run this now?"

## Command Rules

- Base command: `npx playwright test`
- If run directory is not the current location, prefer two-line commands:
  - `cd <run-directory>`
  - `npx playwright test ...`
- If user asks for one line, use shell-appropriate syntax (for example PowerShell `;`, bash/zsh `&&`).
- File target: append the spec path.
- Folder target: append folder path.
- Title filter: use `-g "pattern"`.
- Project: use `--project=<name>`.
- Headed: use `--headed`.
- Workers/parallel: use `--workers=<n>`.
- Debug: use `--debug`.
- UI mode: use `--ui`.
- Trace: use `--trace on` or `--trace retain-on-failure` when requested.
- Retries: use `--retries=<n>`.
- Reporter: use `--reporter=<name>`.
- Repeatable local run when stability matters: suggest `--workers=1` when user asks for serial execution.
- For per-file command lists, output one command per line (one file target per command).

## Defaults for Ambiguous Requests

- If the user asks for "parallel" but does not specify worker count, infer workers with best effort:
  - two named targets -> `--workers=2`
  - three or more named targets -> `--workers=4`
  - broad target ("all tests") -> `--workers=4`
- If run directory is not specified in the current prompt, use the remembered run directory. Default is `tests/`.
- If the user names tests in plain language (for example "homepage and login"), map those names to likely file/folder paths and output a runnable best-guess command.
- For multiple named targets, prefer one command that includes all target paths after `npx playwright test`.
- Include debug flags only when explicitly requested (`debug`, `pw:debug`, step-through, inspector). Never add debug by default.
- If debug is requested and workers are not specified, default to `--workers=1`.

## Run Directory Memory Rules

- Initial value is `tests/`.
- If `tests/` does not exist, fallback default to project root (`.`) and keep that as the session default.
- Update memory when the user says:
  - "run from project root"
  - "run from <directory>"
  - "playwright package is in <directory>"
- Keep using the remembered value until user says:
  - "change run directory to <directory>"
  - "reset run directory"
- On "reset run directory", set back to `tests/`.

## Memory Scope

- Run-directory memory and recent-command memory are conversation/session scoped.
- Do not assume memory persists into a new chat.

## Recent Command Memory Rules

- Keep a conversation-level `last-command` state with the most recent generated command.
- When user references prior output ("same command", "last command", "rerun that"), start from `last-command` and apply requested changes.
- Supported change intents include:
  - toggle headed/headless
  - add/remove debug
  - change workers
  - add/remove project
  - add/remove grep pattern
- If no `last-command` exists yet and user asks to reuse it, ask for one short clarification.
- After generating a new command, update `last-command`.

## Save-to-File Rules

- Only save commands when the user explicitly requests it.
- Default save path `playwright-commands.txt` is relative to workspace/project root.
- Save format is plain text with one runnable command per line.
- For multi-file requests (for example "5 test files"), generate one command per file.
- If useful, include an optional "run all" command as the first line, followed by per-file commands.
- Confirm where the file was written and whether it was overwritten or appended.

## Output Format

Always provide:

1. `Primary command`
2. `Optional variants` (only if useful)
3. `Notes` (only if user needs clarification, otherwise omit)

Keep output short. Do not add unrelated explanation.

In `execute-now` mode, also provide:

4. `Execution result` (pass/fail and key output summary)

## Guardrails

- Do not invent file paths. If path is unknown, ask or discover first.
- If you provide a best-guess path, label it as an assumption and add a safer alternative command when possible.
- Never execute in `command-only` mode.
- Execute only in `execute-now` mode or when user explicitly confirms execution.
- On any ambiguity, do not execute until user confirms.
- Do not save command files unless the user explicitly asks to save/export/write.
- Keep command examples shell-safe with quoted patterns, for example: `-g "checkout happy path"`.
- Use forward-slash paths in commands for cross-platform consistency.
- Keep output command-first; keep explanations brief.
- If using remembered non-default directory, include a short note: `Using run directory: <directory>`.
- If command is based on memory, optionally include: `Based on last command`.
- Do not hardcode `&&` for chained commands unless shell is explicitly bash/zsh.

## References

- Usage examples: [examples.md](examples.md)
