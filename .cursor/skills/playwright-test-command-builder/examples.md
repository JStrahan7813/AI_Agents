# Examples

## Run all tests

`npx playwright test`

## Intent split: command-only

User: "give me a command to run homepage tests"

Output:
`cd tests/; npx playwright test tests/e2e/homepage`

## Intent split: execute-now

User: "run homepage tests"

Command shown:
`cd tests/; npx playwright test tests/e2e/homepage`

Then execute and report result summary.

## Intent split: ambiguous request (safe default)

User: "homepage tests please"

Output command:
`cd tests/; npx playwright test tests/e2e/homepage`

Follow-up question:
"Do you want me to run this now?"

## Run all tests in parallel from default test folder

`cd tests/; npx playwright test --workers=4`

## Fallback when `tests/` folder does not exist

Note: `tests/` not found, using project root for this session.

`npx playwright test --workers=4`

## Run one spec in nested folder

`npx playwright test tests/e2e/checkout/payments/checkout-card.spec.ts`

## Run a whole folder

`npx playwright test tests/e2e/checkout`

## Run by title pattern

`npx playwright test -g "guest checkout"`

## Headed run

`npx playwright test tests/e2e/smoke/login.spec.ts --headed`

## Debug a single test flow

`npx playwright test tests/e2e/smoke/login.spec.ts --debug --headed --workers=1`

## Run in a specific project

`npx playwright test tests/e2e/smoke/login.spec.ts --project=chromium`

## Run with custom parallelism

`npx playwright test tests/e2e/regression --workers=4`

## Natural language request: "run homepage and login tests in parallel"

`npx playwright test tests/e2e/homepage tests/e2e/login --workers=2`

## User override: run from project root

`cd .; npx playwright test tests/e2e/homepage tests/e2e/login --workers=2`

## Remembered override in later request

`cd .; npx playwright test --workers=4`

## Playwright package in custom directory

`cd apps/web; npx playwright test tests/e2e/smoke/login.spec.ts --headed`

## Save commands to file (user asks: "save commands for 5 test files")

File: `playwright-commands.txt`

`cd tests/; npx playwright test tests/e2e/homepage.spec.ts`
`cd tests/; npx playwright test tests/e2e/login.spec.ts`
`cd tests/; npx playwright test tests/e2e/search.spec.ts`
`cd tests/; npx playwright test tests/e2e/cart.spec.ts`
`cd tests/; npx playwright test tests/e2e/checkout.spec.ts`

## Save commands with parallel workers

File: `playwright-commands.txt`

Location: workspace/project root

`cd tests/; npx playwright test tests/e2e/homepage.spec.ts --workers=2`
`cd tests/; npx playwright test tests/e2e/login.spec.ts --workers=2`

## CI-like run with retries and trace

`npx playwright test tests/e2e/regression --retries=2 --trace retain-on-failure`

## Use a glob pattern

`npx playwright test "tests/**/checkout*.spec.ts"`

## Discovery failure: no matching test path found

User: "run loyalty tests"

Output:
No exact test match found. Closest paths:
- `tests/e2e/login`
- `tests/e2e/checkout`
- `tests/e2e/profile`

Question:
"Which path should I use?"

## Combine file + title filter + reporter

`npx playwright test tests/e2e/checkout/checkout-card.spec.ts -g "visa success" --reporter=line`

## Debug only when requested

`npx playwright test tests/e2e/homepage/homepage.spec.ts --debug --headed --workers=1`

## Recent command memory: "same command but headed"

Previous command:
`cd tests/; npx playwright test tests/e2e/login.spec.ts --workers=2`

New output:
`cd tests/; npx playwright test tests/e2e/login.spec.ts --workers=2 --headed`

## Recent command memory: "rerun last with workers 1 and debug"

Previous command:
`cd tests/; npx playwright test tests/e2e/checkout.spec.ts --workers=4`

New output:
`cd tests/; npx playwright test tests/e2e/checkout.spec.ts --workers=1 --debug`
