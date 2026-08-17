# AgentDock Skills-Registry Template — Agent Execution Boundaries

> For AI coding agents (GitHub Copilot CLI, Claude, etc.) running in projects generated from
> this template.

## What this repository is

A **public Agent Skills content registry**: `skills/<name>/SKILL.md` canon in git, a generated
`skills.json` manifest at the repo root, a Fumadocs site, and three CI gates. It is a content
repo, not a product codebase — most contributions are "add or edit a skill," which is
intentionally lightweight (see the table below).

## What needs OpenSpec vs. what doesn't

This is the load-bearing rule in this template. Getting it wrong either blocks legitimate
content contributions with unnecessary process, or lets a real infrastructure change slip in
without review.

| Change                                               | Needs OpenSpec proposal? | Gate                                          |
| ---------------------------------------------------- | :----------------------: | --------------------------------------------- |
| Add a new `skills/<name>/SKILL.md`                   |            No            | `agentdock skill validate` passes + PR review |
| Edit an existing skill's content or frontmatter      |            No            | `agentdock skill validate` passes + PR review |
| Remove a skill                                       |            No            | PR review                                     |
| Change the `skills.json` manifest schema/fields      |         **Yes**          | OpenSpec proposal + tasks + PR review         |
| Change a gate script's rules (`scripts/gates/*.mjs`) |         **Yes**          | OpenSpec proposal + tasks + PR review         |
| Change `boundary-rules.json` pattern categories      |         **Yes**          | OpenSpec proposal + tasks + PR review         |
| Change the docs site's structure (not content)       |         **Yes**          | OpenSpec proposal + tasks + PR review         |

The rule of thumb: if the change alters what the machine checks or what a manifest entry means,
it's infrastructure — write a proposal. If it only adds/edits/removes an entry within an
existing contract, it's content — skip openspec, go straight to a PR.

See `openspec/config.yaml`'s `context` block for the same narrowing, written for the AI that
authors OpenSpec artifacts directly.

## Bootstrap: the first command after `agentdock init`

`skill publish` derives each manifest entry's `source` from **this repo's own git remote**, so
a template can never ship a correct `skills.json` — it doesn't know where you'll host the repo.
The shipped `skills.json` has a placeholder `source`. **Run this before anything else**:

```bash
pnpm skills:sync
```

This republishes every `skills/*` skill into `skills.json` (using your repo's real git remote)
and regenerates the `apps/docs/content/docs/skills/*` pages from it. Gate ② fails until you do
this, and its failure message says so.

## Language Policy

This repo has a public, mixed-language audience: AI agents that consume `skills.json` and
`skills/*/SKILL.md` directly, and humans (English- and Chinese-speaking) who read the README and
docs site. Different artifacts have different consumers, so they get different language rules.

| Artifact                | Language                                        | Why                                                                                     |
| ------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Issues / PRs             | English-first                                    | Widest reviewer/contributor reach for a public repo                                     |
| `skills/*/SKILL.md`      | **English only**                                 | Its consumer is an AI agent, not a human — see below                                    |
| `README`                 | **Both**: `README.md` = English (default), `README.zh-CN.md` = Chinese | One canonical default for GitHub's landing view, one companion for Chinese readers      |
| Docs site (`apps/docs`)  | **Both**, English default (`/docs`), Chinese under `/zh/docs` | Same audience split as README, but browsable/searchable                                 |

**Why `skills/*/SKILL.md` is English-only**: a skill's `description` field is not prose for a
human reader — it's read by machines. It's the exact string a `skills.json` consumer (an AI
agent deciding whether to install a skill) matches against, and it's what gets embedded/searched
by tooling. Mixed-language or non-English descriptions degrade that machine-matching in ways a
human skimming a README never notices. This applies to **new** skills going forward.

### Two hard rules

1. **No mixed-language files.** A single file is either entirely English or entirely Chinese —
   never both in the same document. This applies to every artifact in the table above.
2. **Already-committed content stays as-is.** This policy is not retroactive — do not go back
   and translate or rewrite existing content to conform. `skills/lesson-prep/SKILL.md`, for
   example, is Chinese and stays Chinese; it predates this policy and is grandfathered in. The
   policy governs **new** content from here on.

## Autonomy Boundaries

### May execute autonomously

- `pnpm install`, `pnpm build`, `pnpm check-types`, `pnpm lint`, `pnpm skills:sync`, `pnpm gates`
- Creating / editing `skills/<name>/SKILL.md` files
- Creating / updating MDX documentation in `apps/docs/content/docs/` (except the generated
  `apps/docs/content/docs/skills/*` pages — those come from `skills.json`, edit the skill
  instead and re-run `pnpm skills:sync`)
- Running `openspec` CLI commands (read-only: `list`, `status`, `instructions`, `validate`)

### Must pause and confirm

- Any `git push`, `git push --force`, or publishing to a registry
- Deleting files (including tracked files)
- Adding new **top-level** directories outside the monorepo contract (`apps/`, `packages/`,
  `skills/`, `scripts/`)
- Adding new `dependencies` or `devDependencies` to any `package.json`
- Any change to `openspec/config.yaml`
- Editing `scripts/gates/*.mjs` or `boundary-rules.json` (infrastructure — needs a proposal
  first, see the table above)
- Hand-editing `skills.json` or `apps/docs/content/docs/skills/*` (both are generated — edit
  the source skill and run `pnpm skills:sync` instead)

### Prohibited

- Writing real secrets, API keys, or credentials anywhere
- Running `rm -rf` on tracked directories
- Bypassing git hooks with `--no-verify`
- Committing a skill whose `skills/<name>/` directory name doesn't match its SKILL.md `name`
  frontmatter field (gate ① rejects this)
- Weakening `boundary-rules.json` to make gate ③ pass on content that should have been
  redacted instead

## Acceptance Criteria (before marking a task done)

1. `pnpm install` — exits 0.
2. `pnpm check-types` — exits 0.
3. `pnpm build` — exits 0.
4. `pnpm gates` — all three gates pass (after `pnpm skills:sync` if `skills/` changed).
5. New/edited skills pass `agentdock skill validate <dir>`.
6. No real secrets detected (`pnpm exec secretlint '**/*'` if configured, or manual grep for
   common key patterns).
