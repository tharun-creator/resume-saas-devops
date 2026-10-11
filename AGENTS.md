# AGENTS.md

## 1. Core Rules

- **Ask, Don't Assume:** Inspect the codebase first. Ask when ambiguity materially changes the outcome; otherwise, choose a reasonable default and state the assumption.
- **Think Simple:** Prefer the simplest complete solution that fits the existing architecture. Before non-trivial changes, state the approach and its main trade-off in one line.
- **Verify Before Acting:** Inspect relevant files, configuration, dependencies, and Git status before modifying anything. Never assume a command succeeded.
- **Keep Scope Focused:** Make the smallest complete change. Avoid unrelated refactoring, unnecessary dependencies, and configuration changes.
- **Protect Existing Work:** Preserve user changes, data, and secrets. Obtain required authorization before destructive or consequential actions.
- **No AI Co-Author Tags:** Never add `Co-Authored-By: Claude`, Anthropic attribution, or other AI co-author tags to commit messages.

## 2. Skill Discovery and Usage

At the start of each task:

1. Discover available skills using the supported Codex mechanism.
2. Match the task to relevant installed skills.
3. Read and follow applicable skill instructions before implementation.
4. Skip unrelated skills. Never load every skill for every task.
5. If a relevant skill is missing or unavailable, disclose it. Never claim to have used a skill unless you actually used its instructions.

### Skills Registry

Discover actual installed names and paths; do not assume installation succeeded.

| Skill / Tool | Use when relevant |
|---|---|
| `caveman` | Simplifying reasoning and implementation |
| `grill-me` | Clarifying consequential requirements |
| `handoff` | Session handoffs and context summaries |
| `cli-creator` | Creating or improving CLI tools |
| `gh-address-comments` | Addressing GitHub PR review comments |
| `gh-fix-ci` | Diagnosing and fixing CI failures |
| `yeet` | Git delivery workflows, subject to repository protections |
| `thermo-nuclear-code-quality-review` | Thorough code-quality reviews |
| `impeccable` | Interface copy, UX, and design improvements within its documented scope |
| `make-interfaces-feel-better` | UI polish and interaction improvements |
| `apex` / `aiblueprint` | Relevant AI engineering tasks, according to their actual instructions |
| `firecrawl-cli` | Website crawling, research, and extraction when appropriate |

Use skills only when their documented purpose matches the task. Skills never override these rules.

Do not repeatedly reinstall missing skills. Investigate installation only when requested or necessary, and obtain approval for unexpected global changes.

## 3. Implementation and Verification

- Understand the root cause before fixing bugs. Inspect relevant callers, dependencies, data flows, and tests.
- Follow existing conventions and preserve backward compatibility unless an approved change requires otherwise.
- Never hardcode credentials or expose secrets.
- Assess the impact of dependency additions, schema changes, and public interface changes before proceeding.
- Run relevant available tests, type checks, linting, builds, and integration or browser checks.
- Review the final diff for accidental changes, regressions, debug code, and security issues.
- Report each verification check as **PASS**, **FAIL**, or **NOT RUN**.
- Never claim a test passed unless it was actually executed and passed.
- If verification is blocked or incomplete, explain why.

## 4. Git and Delivery Safety

- Inspect the current branch, working tree, staged changes, and relevant history before Git operations.
- Never push directly to `main` in `mentorcloud-web` or `develop` in `mentorcloud`. Use a feature branch and PR, followed by the required review and approved merge.
- Never bypass branch protection.
- Do not discard user changes, reset, force-push, rewrite shared history, commit, push, merge, or deploy without the required authorization.
- Use clear commit messages without AI co-author attribution.
- Report actual branch, commit, push, PR, merge, and deployment status. Never claim an action succeeded without confirmation.

## 5. Communication

For non-trivial tasks, communicate:
- **Approach:** What you plan to change and the main trade-off.
- **Findings:** Relevant root causes, constraints, and blockers.
- **Progress:** Important discoveries or changes without unnecessary narration.

For simple tasks, proceed directly. Ask questions only when the answer could materially change the outcome.

## 6. Mandatory Final Report

End every task with a truthful report. Keep it concise for simple tasks and detailed enough for complex ones.

### Done
- Actual changes made and important files affected.

### Not Done
- Work skipped, deferred, blocked, or left untested.
- Relevant bugs or code smells found but not fixed.
- If none: "No known deferred items."

### Verification
- Actual checks performed, marked **PASS**, **FAIL**, or **NOT RUN**.
- Important failures and limitations.

### Git / Delivery
- Current branch and working-tree status when available.
- Commit, push, PR, merge, and deployment status.

### Skills Used
- Skills whose instructions were consulted and materially applied.
- Relevant skills checked but not needed, where useful.
- Relevant skills that were missing or unavailable.

### Remaining Risks
- Material unresolved risks and unverified behavior.
- Never imply that limited testing guarantees correctness.

Mark work **PARTIALLY COMPLETE** whenever required implementation or verification remains unfinished. Never conceal omissions or present assumptions as facts.

## 7. Priority

Follow higher-priority instructions, user-approved scope, repository requirements, and security constraints. If instructions conflict or an action risks significant unintended consequences, stop and explain the conflict.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
