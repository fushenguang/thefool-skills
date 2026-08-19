---
name: format-markdown
description: Restructures plain text or loosely-formatted Markdown into clean, readable Markdown — headings, paragraphs, lists, tables, code fences, and emphasis — without changing the author's words. Use when the user asks to "format", "tidy up", "clean up", "beautify", or "restructure" an article, note, transcript, or Markdown file, or says the text is hard to read. Writes a new file and never overwrites the original.
license: MIT
metadata:
  version: "1.0.0"
  thefool.channel: official
---

# Format Markdown

Turn a wall of text into something a reader can scan — **without becoming a co-author**.

## The one rule that outranks everything

**Do not change what the text says.** You may only change how it looks.

Allowed: adding structure (headings, lists, tables, code fences), adjusting emphasis, fixing
whitespace, splitting or joining paragraphs, and correcting unambiguous typos.

Not allowed: adding sentences, deleting sentences, summarising, rewording for style, "improving"
an argument, inventing section titles that assert something the text never said, or reordering
content to a structure you find more logical.

If you believe a passage is wrong, unclear, or missing something — **say so in your final report to
the user, not in the file**.

## Workflow

### Step 1 — Read and classify

Read the whole input first. Decide which case you are in:

- **Plain text**: no Markdown markers at all. You are adding structure from scratch.
- **Loose Markdown**: some markers exist but are inconsistent (mixed heading levels, manual `-`
  bullets mixed with `*`, code shown as indented text). You are normalising.
- **Already clean**: little to do. Say so and stop — do not manufacture changes to look busy.

### Step 2 — Find the structure that is already there

Structure is **discovered, not invented**. Look for signals the author already gave:

| Signal in the text | Becomes |
|---|---|
| A short line followed by a blank line and a block of prose | A heading |
| "First… Second… Third…", "1) … 2) …" | An ordered list |
| Repeated parallel phrases, one per line | An unordered list |
| Repeated `key: value` pairs across several lines | A table, only if 3+ rows share the same shape |
| Indented block, or text full of `{}`, `()`, `$`, file paths | A fenced code block |
| A term defined then reused throughout | Bold **on first occurrence only** |

If a heading would need words the author never wrote, use their own words — a truncated phrase from
the paragraph is better than a title you made up.

### Step 3 — Apply the formatting rules

**Headings**
- One `#` H1 at most, only if the text has an actual title. Never invent one.
- Do not skip levels (`##` then `####`).
- No trailing colons or punctuation in headings.

**Paragraphs**
- One blank line between blocks. Never two or more.
- Split paragraphs longer than roughly 5 sentences at a natural topic shift — a shift the author
  already made, not one you introduce.

**Lists**
- `-` for unordered, `1.` for ordered. Never mix markers within one list.
- Keep list items parallel in grammatical form only if the author already wrote them that way.
- Nest at most two levels; deeper nesting means the content wants a table or sub-headings.

**Emphasis**
- **Bold** for terms and decisive statements. *Italic* for light stress or first use of jargon.
- Ceiling: **at most one bolded fragment per paragraph.** If everything is bold, nothing is.

**Code**
- Fence every command, path, identifier, config, or log line.
- Add a language tag when it is unambiguous (`bash`, `json`, `sql`, `ts`). When unsure, leave the
  tag off — a wrong tag is worse than none.
- Inline `code` for identifiers appearing mid-sentence.

**Tables**
- Only when 3+ rows share the same shape. Two rows read better as a list.
- Keep cells short; move long prose out of the table and reference it below.

**Typos**
- Fix only unambiguous ones: doubled words, obvious misspellings, missing sentence-ending periods,
  mismatched brackets or quotes.
- Never "fix" terminology, names, numbers, or anything whose correctness you would have to guess.

### Step 4 — Write the output file

Write to `<original-basename>-formatted.md` next to the input. **Never overwrite the input.**

If that path already exists, append a numeric suffix (`-formatted-2.md`) rather than replacing it.

Preserve any YAML frontmatter in the input **byte for byte** at the top of the output. Frontmatter
is data, not prose — reformatting it can break whatever consumes it.

### Step 5 — Verify before reporting

Run these checks on your own output. They are cheap and they catch the failure this skill exists to
prevent:

1. **Nothing lost**: every sentence in the input still appears in the output. Compare
   sentence counts; a drop means you deleted something.
2. **Nothing added**: no sentence in the output is absent from the input, apart from Markdown
   markup itself.
3. **Numbers, names, code, and URLs are byte-identical** to the input.
4. Fences are balanced; no stray backticks.
5. No heading level is skipped.

If check 1 or 2 fails, **discard the output and redo it** — do not patch it up.

### Step 6 — Report

Tell the user, in this order:

1. The output file path.
2. What structure you applied, in one or two lines (e.g. "added 4 headings, converted 3 paragraphs
   to a list, fenced 6 commands").
3. **Anything you deliberately did not touch**, and why — passages you found unclear, contradictory,
   or possibly wrong. This is the part of the report with real value: it is the content feedback the
   file itself must not contain.

## Edge cases

| Situation | What to do |
|---|---|
| Input mixes two languages | Format both; never translate |
| Input is already well-formatted | Say so, produce no file, and stop |
| Input contains a table that is already Markdown | Leave alignment as-is unless a row is broken |
| Input is a transcript or chat log | Preserve speaker turns as-is; do not merge speakers |
| Input has no clear structure at all (e.g. a poem) | Apply whitespace and fences only — no headings, no lists |
| Input is enormous (> ~2000 lines) | Format it in sections, but write one output file |
