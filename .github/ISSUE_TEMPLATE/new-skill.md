---
name: New skill submission
about: Propose a new skill to add to skills/
title: "[skill] "
labels: skill
---

<!-- Skills must be written in English. This template, and the skill's SKILL.md, should both
     be entirely in English. -->

## Skill name

<!-- Matches the directory name under `skills/<name>/` and the `name` field in SKILL.md. -->

## Summary

<!-- One or two sentences: what does this skill let an agent do? -->

## `description` (as it will appear in `skills.json`)

<!-- This is the exact string agents match against when deciding whether to use the skill.
     Must be in English, one sentence, specific about what the skill does and when to use it. -->

## License / ownership

- [ ] I own this content outright (or have explicit permission to publish it under MIT), and it
      is not a repackaging of a third-party-licensed skill (Apache-2.0, vendor-proprietary, etc.)
- [ ] The skill contains no private/internal identifiers (host project names, internal domains,
      credentials) — see `boundary-rules.json` / gate ③

## Checklist

- [ ] `SKILL.md` is written entirely in English
- [ ] `skills/<name>/` directory name matches the `name` field in SKILL.md frontmatter
- [ ] `agentdock skill validate skills/<name>` passes locally (gate ①)
- [ ] `pnpm skills:sync` has been run and the regenerated `skills.json` +
      `apps/docs/content/docs/en/skills/*` are included in the PR
- [ ] This is a content contribution (no OpenSpec proposal needed) — see `AGENTS.md`
