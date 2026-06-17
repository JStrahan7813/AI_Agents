---
name: playwright-axe-accessibility
description: Sets up Playwright + axe-core accessibility testing—helper, report folders, and generates tests using Playwright MCP to find selectors. Use when the user wants an accessibility test environment, to create accessibility tests for given elements (e.g. "create an accessibility test for the page body"), or axe-core reports in markdown.
---

# Playwright + axe-core Accessibility Testing

**Use this skill when the user wants to** set up an accessibility test environment with Playwright and axe-core, or to create accessibility tests for specific areas of the page (e.g. "create an accessibility test for the page body", "accessibility test for the header", "a11y test for #main-content").

**Selector discovery:** Use **Playwright MCP** to find selectors before creating tests. Do not guess selectors from the user’s prompt; use MCP tools to navigate to the page, capture a snapshot, and derive stable selectors from the accessibility tree, then generate the test using those selectors.

**Standard:** All accessibility tests must run against **WCAG 2.1 Level AA and below** (i.e. WCAG 2.0 Level A, 2.0 Level AA, 2.1 Level A, and 2.1 Level AA). In axe-core this is done by limiting rules with `.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])` before calling `.analyze()`.

## Scope

When invoked, create **everything** needed for accessibility testing:

1. **Dependency**: Install the axe-core package only if not already installed.
2. **Folders**: Create `tests/helpers` and `tests/accessibility-reports` only if they do not already exist.
3. **Helper**: Create or update the accessibility helper and ensure tests can generate markdown reports.
4. **Tests**: Generate Playwright tests that run axe on the specified element(s) and write a markdown report. Use **Playwright MCP** to find selectors (navigate → snapshot → derive selectors) before creating each test.

Do not assume the helper or folders exist; the skill is responsible for creating them when setting up or when creating new tests.

---

## 1. Dependency

- **Check** `package.json` for `@axe-core/playwright` (preferred for Playwright) or `@axe-core/webdriverjs`.
- **Install** `@axe-core/playwright` only if neither is present:  
  `npm install -D @axe-core/playwright`
- For Playwright-based tests, use `@axe-core/playwright` in the helper (it works with Playwright's `page`). Use `@axe-core/webdriverjs` only if the project uses WebDriver/Selenium instead of Playwright.

---

## 2. Folders

- Create **`tests/helpers`** only if it does not already exist.
- Create **`tests/accessibility-reports`** only if it does not already exist.
- Use the project’s existing test directory (e.g. `tests` from `agent-config.json` or playwright config) as the parent for both.

---

## 3. Helper: `tests/helpers/accessibility.ts`

Create this file (or update it to match this contract) so that tests can run axe on a given part of the page and get a markdown report.

**Import requirement:** Use the **named** import for `AxeBuilder`. Do not use the default import, or TypeScript/ESM may treat it as non-constructable and report "has no construct signatures":

- **Correct:** `import { AxeBuilder } from '@axe-core/playwright';`
- **Wrong:** `import AxeBuilder from '@axe-core/playwright';`

**Responsibilities:**

- Run axe-core (via `@axe-core/playwright`) on the Playwright `page`, scoped to a **selector** the user specifies (e.g. `body`, `#main`, `.content`).
- **Limit rules to WCAG 2.1 AA and below** using `AxeBuilder#withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])` before `include(selector)` and `analyze()`. Do not run the full rule set.
- Return the axe result object (violations, passes, incomplete, inapplicable).
- Format the result as **markdown** including:
  - Title and timestamp.
  - **Area(s) tested**: the selector(s) or description of the page area (e.g. "Page body", "Selector: `body`").
  - **Summary**: counts of violations, passes, incomplete, inapplicable.
  - **What was scanned (tested nodes)**: a sample of the node selectors axe actually ran on (from passes, violations, and incomplete), so reviewers can verify the scope. Derive from result nodes (e.g. unique `node.target` values) and cap the sample (e.g. 100) to keep the report readable.
  - **Violations**: for each violation, rule id, impact, description, help URL, and **affected nodes** (selector and snippet per node).
  - **Incomplete (needs manual review)**: for each incomplete rule, rule id, description, help URL, and **nodes to review** (selector and snippet per node). Incomplete means axe could not determine pass/fail; listing nodes ensures reviewers know exactly which elements to check manually (e.g. for color-contrast).
  - Optional: passes section (rule id and description) if useful.
- **Write the report** to a file under **`tests/accessibility-reports`** (e.g. `accessibility-report-<timestamp>.md` or a name derived from the test/selector).
- Ensure the reports directory exists before writing (create it only if it does not exist).

**Suggested API** (adapt to existing patterns):

- `runAccessibilityTest(page: Page, options: { selector?: string; reportFileName?: string }): Promise<{ results: AxeResults; reportPath: string }>`
  - Default selector: `'body'` (whole page).
  - Build axe with `AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).include(selector).analyze()` (WCAG 2.1 AA and below).
  - Format with a function like `formatAxeResultsAsMarkdown(results, { areaDescription: selector })`.
  - Write markdown to `tests/accessibility-reports/<reportFileName>.md` and return the path and results.

Use `path.join(__dirname, '..', 'accessibility-reports', reportFileName)` (or equivalent) so the path is correct when the helper lives in `tests/helpers`.

---

## 4. Finding Selectors with Playwright MCP (required before creating tests)

When the user asks for an accessibility test for a specific area, **use Playwright MCP to discover selectors** instead of inferring them from the prompt. Only after obtaining selectors from MCP should you generate the test file.

**Workflow:**

1. **Navigate to the page under test**
   - Use the **Playwright MCP** tool **`browser_navigate`** (or equivalent) with the app’s URL (e.g. `baseURL` from `agent-config.json` or the path the user specified). Ensure the target page is loaded.

2. **Capture the page structure**
   - Use the **Playwright MCP** tool **`browser_snapshot`** to get a structured accessibility snapshot of the current page. The snapshot exposes the accessibility tree with roles, names, and refs/labels that map to elements.

3. **Derive selectors from the snapshot**
   - From the snapshot, identify the element(s) that match the user’s request (e.g. "page body" → root/document or `body`; "header" → element with role banner or `<header>`; "main content" → `main` or landmark with role main).
   - Choose **stable selectors** suitable for axe and Playwright: prefer semantic selectors (e.g. `body`, `main`, `header`, `[role="banner"]`, `[role="main"]`) or IDs/stable attributes present in the snapshot. Use the snapshot’s structure (roles, names, hierarchy) to pick a selector that uniquely describes the area.

4. **Create the test using the discovered selector(s)**
   - Add a test file that uses the **selector(s) derived from the MCP snapshot** (not from a fixed mapping of keywords). Pass that selector and a short area description (based on what the user asked for and what the snapshot shows) to the accessibility helper.

If Playwright MCP is not available or the snapshot cannot be obtained, state that to the user and do not invent selectors; ask for the URL and/or selector, or suggest enabling Playwright MCP.

---

## 5. Generating the Test File (after MCP selector discovery)

Once selectors are obtained via Playwright MCP (see §4):

1. **Create a test file** in the test directory (e.g. `tests/accessibility.spec.ts` or `tests/a11y-<area>.spec.ts`) that:
   - Navigates to the page (e.g. `page.goto('/')` or the path used in MCP).
   - **Waits for the target** (if testing a specific area): e.g. `page.waitForSelector(selector, { state: 'attached', timeout: 15000 })` so the element or its container is present.
   - **Adds a stabilization delay before running axe** (see §5.1) so dynamic content (toolbars, dialogs, shadow DOM) has time to render and does not cause timing-related violations or flakiness.
   - Imports and calls the helper from `tests/helpers/accessibility.ts` with the **selector(s) discovered by MCP** and an optional report file name.
   - Documents the area tested (e.g. in the test name and in the report).
2. **Report content**: The generated markdown report must include:
   - The **areas of the page that were specified** (e.g. "Area(s) tested: Page body (selector: `body`)" from the MCP-derived selector).
   - **Tested nodes**: a sample of node selectors that were actually scanned (so scope can be verified).
   - The **results** of the test (violations with rule id, impact, description, help URL, affected nodes; plus summary counts).
   - **Incomplete nodes**: for each incomplete rule, the list of nodes that need manual review (selector and snippet per node).

### 5.1 Timing / stabilization delay before accessibility checks

To avoid false violations and flaky results caused by content that is still rendering (e.g. third-party toolbars, dialogs, or shadow-DOM widgets), **always add a delay after the target is present and before calling the accessibility helper**.

- **After** navigating and (if applicable) waiting for the target selector to be attached, add one or more waits:
  - `await page.waitForTimeout(STABILIZE_MS);` with a constant (e.g. `2000` ms for the main target).
  - For areas that include dialogs or layered UI, add a second delay (e.g. `DIALOG_STABILIZE_MS = 2000`) so the dialog has time to render before axe runs.
- Define named constants at the top of the spec (e.g. `STABILIZE_MS = 2000`, `DIALOG_STABILIZE_MS = 2000`) so they can be tuned without editing the test flow.
- Example flow: `page.goto('')` → `page.waitForSelector(selector, …)` → `page.waitForTimeout(STABILIZE_MS)` → optional `page.waitForTimeout(DIALOG_STABILIZE_MS)` → `runAccessibilityTest(page, …)`.

This applies to all generated accessibility tests, especially for dynamic or injected content (e.g. toolbars, modals, shadow DOM).

---

## 6. Markdown Report Format (template)

Reports saved under `tests/accessibility-reports` should follow this structure:

```markdown
# Accessibility Test Report

**Generated:** <ISO timestamp>
**Area(s) tested:** <description, e.g. "Page body (selector: `body`)")

## Summary

| Metric       | Count |
|-------------|-------|
| Violations  | N     |
| Passes      | N     |
| Incomplete  | N     |
| Inapplicable| N     |

## What was scanned (sample of node selectors)

(List of node selectors axe ran on—from passes, violations, incomplete—so reviewers can verify scope. Cap sample size, e.g. 100.)

## Violations

(For each violation: rule id, impact, description, help URL, **affected nodes** with selector and snippet.)

## Incomplete (needs manual review)

(For each incomplete rule: rule id, description, help URL, **nodes to review** with selector and snippet per node. Incomplete = axe could not determine pass/fail; these nodes need manual checks, e.g. for color-contrast.)
```

Add a **Passes** section (rule id and description) if the helper is configured to include it.

---

## 7. Rules

- Create **only** the folders and files described above; do not create unrelated files.
- **Do not overwrite** existing helper logic without aligning to this contract; merge or update so the helper still runs axe on the given selector and writes markdown to `tests/accessibility-reports`.
- Use the project’s existing test directory and baseURL (e.g. from `agent-config.json` or `playwright.config.ts`) when generating tests.
- Keep the skill self-contained: when the user asks to "create an accessibility test for …", the agent should use Playwright MCP to find selectors, then create the helper and folders if missing, and add the test and report.
- **Playwright MCP is required** for creating new accessibility tests: use it to navigate, snapshot, and derive selectors before writing the test. Do not guess selectors from keywords.

---

## Summary checklist

- [ ] Check for `@axe-core/playwright` (or `@axe-core/webdriverjs`); install `@axe-core/playwright` only if neither is present.
- [ ] Create `tests/helpers` and `tests/accessibility-reports` only if they do not exist.
- [ ] Create or update `tests/helpers/accessibility.ts` to run axe on a given selector with **WCAG 2.1 AA and below** (`.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])`), format results as markdown (including area tested, **tested nodes** sample, violations with affected nodes, **incomplete with nodes to review**), and write to `tests/accessibility-reports`. Use **named** import: `import { AxeBuilder } from '@axe-core/playwright'` (not default import).
- [ ] When the user asks for an accessibility test (e.g. "create an accessibility test for the page body"): use **Playwright MCP** (`browser_navigate`, `browser_snapshot`) to open the page and get the accessibility tree, derive stable selectors from the snapshot, then generate the test using those selectors and ensure the report includes the specified area(s) and full results.
- [ ] **Include a stabilization delay** before running the accessibility helper: wait for the target (if any), then `page.waitForTimeout(STABILIZE_MS)` (and optionally a second delay for dialogs). Use named constants (e.g. `STABILIZE_MS = 2000`, `DIALOG_STABILIZE_MS = 2000`) so future tests avoid timing-related violations and flakiness (see §5.1).
