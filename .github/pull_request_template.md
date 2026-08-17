<!-- Skills must be written in English. Please write this PR description in English too. -->

## Summary

<!-- What does this PR do, and why? -->

## Type of change

- [ ] New skill (`skills/<name>/`)
- [ ] Edit to an existing skill
- [ ] Docs site content (`apps/docs/content/docs`)
- [ ] Infrastructure / contract change (manifest schema, a gate script, `boundary-rules.json`,
      docs site structure) — **requires an approved OpenSpec proposal**, see `AGENTS.md`
- [ ] Other (describe above)

## Checklist

- [ ] `pnpm install` succeeds
- [ ] `pnpm gates` passes locally (all three gates)
- [ ] If `skills/` changed: `pnpm skills:sync` was run and the regenerated `skills.json` +
      `apps/docs/content/docs/en/skills/*` are included in this PR
- [ ] New/changed `SKILL.md` files are written entirely in English
- [ ] No file mixes English and Chinese content (each file is one language, see `AGENTS.md`'s
      Language Policy)
- [ ] No real secrets, API keys, or credentials anywhere in the diff
- [ ] For infrastructure changes: linked OpenSpec proposal is approved

## Related issue(s)

<!-- Closes #... -->
