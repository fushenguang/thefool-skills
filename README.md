# thefool-skills

[中文](./README.zh-CN.md) | English

A public **Agent Skills content registry**: a git repo of `skills/<name>/SKILL.md` canon, a
generated `skills.json` manifest anyone can consume, a Fumadocs documentation site, and three
CI gates that catch the two ways this kind of repo actually breaks — a stale manifest and a
leaked private detail — from day one.

> Generated from the [AgentDock](https://github.com/CogitoTech/agentdock) `skills-registry` template.

**Install a skill**: each manifest entry's `source` + `path` is the address —
`git clone --depth 1 <source>` then take the `<path>` directory. **No credentials needed.**

```bash
curl -s https://raw.githubusercontent.com/fushenguang/thefool-skills/main/skills.json
```

## License & Attribution

- Content in this repo is **MIT**, attributed to [www.fujia.site](https://www.fujia.site),
  **commercial use and adaptation allowed**.
- `lesson-prep` is derived from a frontline Chinese-language teacher's real lesson-prep
  methodology, **used with permission**, and has been de-identified.
- **This repo only accepts content we own outright.** Third-party-licensed skills
  (Apache-2.0 / vendor-proprietary) do not belong here — they aren't ours to re-license. This
  rule is hard; read it before `CONTRIBUTING`.

## Tech Stack

| Layer            | Technology                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Skill validation | [`skills-ref`](https://www.npmjs.com/package/skills-ref) via `@cogito.ai/cli` (Agent Skills spec) |
| Docs             | [Fumadocs](https://fumadocs.dev) on [Next.js 16](https://nextjs.org)                              |
| Language         | [TypeScript 5+](https://www.typescriptlang.org) (strict mode)                                     |
| Gates            | Plain Node.js ESM scripts (`scripts/gates/*.mjs`) — zero build step                               |
| Package manager  | [pnpm](https://pnpm.io) ≥ 9                                                                       |
| Governance       | [OpenSpec](https://github.com/fission-ai/openspec), scoped to infra changes only                  |
| Monorepo         | [Turborepo](https://turbo.build/repo) + pnpm workspaces                                           |

## Directory Structure

```text
skills/
└── <name>/SKILL.md    # Canonical skill content — this is what gets published
skills.json             # Generated manifest, committed to git
apps/
└── docs/               # Fumadocs site; content/docs/{en,zh}/skills/* is generated from skills.json
packages/                # Shared tooling packages (eslint-config, tsconfig)
scripts/
├── gates/               # The three CI gates
└── gen-skill-docs.mjs   # skills.json → docs pages
boundary-rules.json      # Gate ③'s configurable pattern table
openspec/                # Governance — infra/contract changes ONLY, not "add a skill"
```

## Getting Started

### 1. Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9 — `npm install -g pnpm`
- A git remote for this repo (public — `skill publish` derives each manifest entry's `source`
  from it)

### 2. Install dependencies

```bash
pnpm install
```

### 3. ★ Run the bootstrap command — do this first

`skill publish` derives each manifest entry's `source` from **this repo's own git remote**, so
this template cannot ship a correct `skills.json` — it has no way to know where you'll host the
repo. The shipped `skills.json` has a placeholder `source`. Populate the real one:

```bash
pnpm skills:sync
```

This republishes every skill under `skills/` into `skills.json` (using your repo's real git
remote) and regenerates the docs pages in `apps/docs/content/docs/en/skills/`. Gate ② fails
until you run this, and its failure message tells you to.

### 3b. ★ Fill in `hostPrivateIdentifiers` in `boundary-rules.json`

It ships **empty on purpose** — a template cannot know your host project's name, and a wrong
guess is worse than an honest blank. While it is empty, gate ③ prints a warning on every run:
a pass then means _nothing is looking for your project's name_, not that it is absent.

Measured, not assumed: running gate ③ over 14 real skills extracted from a private monorepo,
the generic defaults caught **1** reference to the host — and missed three other spellings of
the same host. After filling in the product name, hits went from 1 to **35** across 6 skills.

### 4. Start development

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) for the docs site (English by default,
Chinese under `/zh`).

## Adding a Skill

Adding a skill is a content contribution, not an infrastructure change — **it does not need an
OpenSpec proposal**. See `AGENTS.md` for the full "what needs openspec vs. what doesn't" table.

**Standard practice for this repo: the skill's files live here.** Put it under `skills/<name>/`
in *this* repo — don't publish a skill whose files live in some other repo by pointing `skill
publish` at a path outside this checkout. Doing that doesn't copy the files in (see "Publishing
a Skill" below); it writes the *other* repo's address into this manifest instead, which breaks
for everyone if that other repo isn't public. Keeping the skill here means `source` naturally
resolves to this repo and `path` naturally resolves to `skills/<name>` — see "Where `source` and
`path` come from" below for why that's what you want.

```bash
mkdir -p skills/my-skill
cat > skills/my-skill/SKILL.md <<'EOF'
---
name: my-skill
description: One sentence, in English — this is the field consumers read from the manifest.
license: MIT
metadata:
  version: "1.0.0"
---

# My Skill

Body content here.
EOF
```

> **Language note**: `skills/*/SKILL.md` must be written in English — it's consumed by AI
> agents, not humans. See `AGENTS.md`'s Language Policy section.

Once the file exists, publish it — see the next section for the full, verified flow.

## Publishing a Skill

This is the real path from "I wrote a `SKILL.md`" to "it's live on
[fujia.site/skills](https://www.fujia.site/skills) and in the desktop app's skill marketplace."
Every command below was run against this repo while writing this guide.

### 1. Prerequisites

- Node.js ≥ 18 (verified on Node 24)
- Nothing to install up front — everything runs through `npx`, which fetches the CLI on demand
- CLI package: [`@cogito.ai/cli`](https://www.npmjs.com/package/@cogito.ai/cli). Always invoke it
  as `npx @cogito.ai/cli@latest ...` — **current published version is `0.15.0`**. Don't rely on
  the `@cogito.ai/cli` pinned in this repo's `devDependencies` (it's older); see "Known
  limitations" below for why that matters.

```bash
npx @cogito.ai/cli@latest --version
# 0.15.0
```

### 2. Sign in

```bash
npx @cogito.ai/cli@latest auth login     # opens a browser for the OAuth flow
npx @cogito.ai/cli@latest auth status    # confirm you're signed in
npx @cogito.ai/cli@latest auth logout    # sign out
```

`auth status` prints a one-line status, e.g. (fields trimmed; `provider` is the identifier of
the host service you're signed in to — replaced with a placeholder here):

```json
{"event":"status","signedIn":true,"provider":"<provider>","userId":"<uuid>","displayName":"<your name>","savedAt":"2026-08-20T08:45:53.215Z"}
```

⚠️ **Known limitation — credentials silently go stale.** Login credentials are valid for **24
hours**. After they expire, `auth status` still reports `signedIn: true` — it only reads the
local credentials file, it does not call the server to check the token. You won't find out from
`auth status`; you'll find out because `skill publish`'s indexing step (step 5 below) silently
downgrades to a warning instead of failing. If a publish looks like it worked but the skill never
shows up on the site, run `auth login` again first. (Tracked as debt:
`cli-auth-token-expires-silently`.)

### 3. `SKILL.md` requirements

`skill publish` reads these frontmatter fields:

| Field              | Required | Notes                                                                |
| ------------------ | -------- | --------------------------------------------------------------------- |
| `name`             | yes      | matches the directory name                                            |
| `description`      | yes      | one sentence, English — this is what consumers read from the manifest |
| `license`          | yes      | e.g. `MIT`                                                             |
| `metadata.version` | yes      | **must be valid [semver](https://semver.org)** (e.g. `"1.0.0"`) — publish is rejected otherwise |

`skills/format-markdown/SKILL.md` in this repo is a real, currently-published skill — use it as
the field reference rather than guessing.

### 4. Validate

```bash
npx @cogito.ai/cli@latest skill validate skills/<name>
# ✓ skills/<name> is a valid skill
```

### 5. Publish

```bash
npx @cogito.ai/cli@latest skill publish skills/<name> --registry .
# ✓ Updated "<name>" in skills.json
```

`--registry` is the path to a **local registry git checkout's root** — for this repo, that's the
repo root itself (`.`), because this repo *is* the registry (it's where `skills.json` lives).

What `publish` does — and does not do:

- ✅ **Writes or updates the manifest entry** in the `skills.json` inside the `--registry`
  directory — always, whether or not you're signed in. Local publish never depends on the
  backend; that's a deliberate portability choice.
- ✅ **If you're signed in**, also indexes the entry into the hosted registry
  (`POST /api/skills/publish`) so it shows up on the web and in the desktop app.
- ❌ **Does not copy the skill's files into the registry checkout.** `--registry` only tells it
  where to find/write `skills.json` — nothing under that directory's `skills/` is touched.
- ❌ **Does not `git commit` or `git push` anything**, in the skill's repo or the registry
  checkout. Confirmed by the CLI's own source (`packages/cli/src/core/skillPublish.ts`,
  `publishSkill()`'s docstring): "the only side effect is writing the manifest file… never
  commits, pushes, or opens a PR." You still commit the manifest yourself — step 7 below.

Boundaries worth knowing:

- **Not signed in** → the manifest write still happens. No network request, no error either.
- **Signed in but indexing fails or times out** → `skills.json` is still written; you get a
  warning, not a hard failure, and the CLI does **not** retry.

**Where `source` and `path` come from — read this before publishing a skill that lives outside
this repo.** They are derived from the *skill directory's own* git repository, not from
`--registry`. `publish`'s `resolveGitSource()` runs `git remote get-url origin` and
`git rev-parse --show-prefix` with its working directory set to the skill directory you pass as
the first argument — never inside `--registry`. So:

- `source` = that skill directory's own repo's `origin` remote (normalized to an `https://` URL)
- `path` = the skill's path relative to *that* repo's root, not relative to `--registry`

This is exactly how everyone installs a skill (see "Install a skill" at the top of this file):
`git clone --depth 1 <source>`, then take `<path>`. So **the repo `source` points at must be
public and reachable**, or the manifest entry is unusable to everyone but the person who
published it — even though `publish` succeeded and even indexed the entry. `skill publish`
does not check reachability; it only reports whatever `origin` it found.

⚠️ Concretely: running `skill publish /path/to/some-other-repo/skills/foo --registry .` from
inside this repo does **not** bring `foo` into `thefool-skills` — it validates `foo` wherever it
already lives, then writes *that other repo's* address as `source` into **this repo's**
`skills.json`. If that other repo is private, the entry is broken for everyone the moment it's
committed here — and it now also names a private repo in a public manifest. The fix, per
"Adding a Skill" above, is to publish skills that actually live under this repo's `skills/<name>/`
so `source` is always this repo and never someone else's.

The manifest entry picks up `version` (from `SKILL.md`'s `metadata.version`) and `author` (from
your signed-in identity). Confirmed by diffing `skills.json` around a real publish of
`format-markdown`:

```diff
       "path": "skills/format-markdown",
       "license": "MIT",
-      "publishedAt": "2026-08-19T12:44:36.922Z"
+      "version": "1.0.0",
+      "author": { "id": "...", "name": "..." },
+      "publishedAt": "2026-08-20T09:23:25.725Z"
```

**Recommended: publish with `--json`** — it's the most reliable way to know what actually
happened (see step 6):

```bash
npx @cogito.ai/cli@latest skill publish skills/<name> --registry . --json
```

### 6. Confirm it's live

**Don't use the HTTP status code of the web page as proof — it proves nothing.**
`https://www.fujia.site/skills/<skill-id>` is a client-side-rendered SPA route: it returns `200`
for *any* id, real or not, and echoes the id back into the shell HTML either way. Verified by
diffing the raw response for a real skill against a made-up one
(`skills/zzz-does-not-exist-999`) — both come back `200` with the same unrendered shell; the
actual skill data loads client-side afterwards, so `curl` (or any status-code check) can't tell
them apart. There's also no plain REST endpoint to `GET` a skill's detail — the web app reads it
through a TanStack `createServerFn`, not a route `curl` can query directly.

**Primary check — read what `skill publish --json` actually reported.** Its JSON result carries
the ground truth (field semantics confirmed by reading the CLI's own source,
`skillPublish.ts` / `registryIndex.ts` in the `agentdock` repo — not guessed from field names):

- `"indexed": true` → the entry is now in the hosted registry — it will show up on the web and
  in the desktop app.
- `"indexed": false` with `"anonymous": true` → you weren't signed in. No request to the server
  was even made — only the local `skills.json` was written. Sign in and publish again.
- `"indexed": false` with `"anonymous": false` → you were signed in, but the index request
  itself failed (bad response, timeout, or network error) — the CLI never retries. The most
  likely cause, per the token-expiry limitation above, is a stale token: run `auth login` again
  and publish again.
- `"updated"` — `true` if this replaced an existing entry with the same skill id (idempotent
  republish), `false` if it created a new one.
- `"versionMissing"` — `true` only when `SKILL.md` had no `metadata.version` at all. An
  *invalid* (non-semver) version is rejected earlier and fails the whole publish instead — it
  never reaches this flag.

**Secondary, human check — actually look at the page.** Open
`https://www.fujia.site/skills/<skill-id>` in a browser and confirm the skill's real name,
description, and the "unscanned" security badge render — not just that the page loaded.

Desktop app: check the skill marketplace inside the app the same way — look for the real entry,
not just "did the app open."

### 7. Commit the manifest

The manifest is the source of truth for this repo, so commit and push it — this does **not**
re-trigger indexing, that already happened in step 5:

```bash
git add skills/my-skill skills.json
git commit -m "feat(skills): add my-skill"
git push
```

Open a PR if you don't have direct push access. The only gates are `skill validate` passing and
review.

### Known limitations

- **`repo-root-skill-cannot-be-indexed`** — a skill placed directly at the repo root (not under
  `skills/<name>/`) cannot currently be indexed; publish returns an error about a missing `path`.
  Always put skills under `skills/<name>/`.
- **CLI version gate** — CLI versions `<= 0.14.0` cannot publish to the hosted registry; they
  get `HTTP 426`. Always run `npx @cogito.ai/cli@latest` (or pin `>= 0.15.0`) rather than
  whatever a project's `devDependencies` happens to have.

## The Three Gates

Run them all locally with:

```bash
pnpm gates
```

| Gate                      | Checks                                                                          | Fails on                                                                                |
| ------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| ① Full validation         | Every `skills/*` against the Agent Skills spec (`agentdock skill validate`)     | Any skill invalid — not just changed ones, so "A's change broke B" doesn't slip through |
| ② Manifest freshness      | `skills.json` vs. a fresh republish of `skills/*`; docs pages vs. `skills.json` | Any field mismatch except `publishedAt` (which changes every publish by design)         |
| ③ Public/private boundary | All git-tracked files vs. `boundary-rules.json` patterns                        | Private repo paths, internal domains, personally identifiable patterns                  |

Full detail on each gate, including how to read a failure:
`apps/docs/content/docs/en/template/gates.mdx`.

## Development

### Common commands

```bash
pnpm dev              # Start the docs site dev server
pnpm build            # Build all workspace packages/apps
pnpm check-types      # TypeScript check
pnpm lint             # ESLint
pnpm skills:sync      # Regenerate skills.json + docs from skills/
pnpm gates            # Run all three CI gates locally
```

## Governance (OpenSpec)

This project uses [OpenSpec](https://github.com/fission-ai/openspec), but **only for
infrastructure/contract changes** — manifest schema, gate rules, docs structure. Adding a skill
does not go through it. See `openspec/config.yaml`'s `context` block and `AGENTS.md`.

```bash
openspec list                                  # List all changes
openspec status --change <name>                # Check change artifact status
openspec instructions apply --change <name>    # Get implementation instructions
```

## FAQs

**Q: Gate ② fails right after I ran `agentdock init` — before I've touched anything.**
A: Expected. Run `pnpm skills:sync` first (see step 3 above) — the shipped `skills.json` has a
placeholder `source` because the template can't know your repo's git remote in advance.

**Q: I edited a skill's `description` — why does gate ② fail?**
A: `skills.json` is generated, not hand-maintained. Run `pnpm skills:sync` to regenerate it,
then commit the updated `skills.json` alongside your skill change.

**Q: Why doesn't adding a skill need an OpenSpec proposal?**
A: OpenSpec is scoped to changes that alter the manifest schema, gate rules, or docs structure.
Adding a skill is a content contribution within an existing contract — see `AGENTS.md`'s table.

**Q: Can AI agents work in this project?**
A: Yes — see `AGENTS.md` for the autonomy boundary contract.

**Q: I ran `skill publish` and it said "Updated", but the skill isn't on the site.**
A: Your login token is probably stale — `auth status` doesn't verify it against the server, so
it'll happily say `signedIn: true` on an expired token. Run `auth login` again, then re-run
`skill publish`. See "Publishing a Skill" → step 2.

**Q: My skill is at the repo root, not under `skills/<name>/` — publish fails with a `path`
error.**
A: Known limitation, not a bug in your setup — the indexer currently requires the skill to live
under `skills/<name>/`. Move it there and re-publish.

## Contributing

This project follows [Conventional Commits](https://www.conventionalcommits.org):

```
feat(skills): add pdf-extraction skill
fix(gates): correct manifest-fresh diff for optional fields
chore: update dependencies
```

Issues and PRs are English-first — see `AGENTS.md`'s Language Policy section for the full rules
(skills are English-only, docs are bilingual, no mixed-language files).

## License

MIT
