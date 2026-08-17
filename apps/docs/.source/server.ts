// @ts-nocheck
import { default as __fd_glob_27 } from "../content/docs/zh/template/meta.json?collection=docs"
import { default as __fd_glob_26 } from "../content/docs/en/decisions/meta.json?collection=docs"
import { default as __fd_glob_25 } from "../content/docs/zh/roadmap/meta.json?collection=docs"
import { default as __fd_glob_24 } from "../content/docs/zh/decisions/meta.json?collection=docs"
import { default as __fd_glob_23 } from "../content/docs/zh/changelog/meta.json?collection=docs"
import { default as __fd_glob_22 } from "../content/docs/en/template/meta.json?collection=docs"
import { default as __fd_glob_21 } from "../content/docs/en/skills/meta.json?collection=docs"
import { default as __fd_glob_20 } from "../content/docs/en/roadmap/meta.json?collection=docs"
import { default as __fd_glob_19 } from "../content/docs/en/changelog/meta.json?collection=docs"
import { default as __fd_glob_18 } from "../content/docs/zh/meta.json?collection=docs"
import { default as __fd_glob_17 } from "../content/docs/en/meta.json?collection=docs"
import * as __fd_glob_16 from "../content/docs/en/template/skill-authoring.mdx?collection=docs"
import * as __fd_glob_15 from "../content/docs/en/template/getting-started.mdx?collection=docs"
import * as __fd_glob_14 from "../content/docs/en/template/gates.mdx?collection=docs"
import * as __fd_glob_13 from "../content/docs/en/skills/lesson-prep.mdx?collection=docs"
import * as __fd_glob_12 from "../content/docs/en/skills/imap-smtp-email.mdx?collection=docs"
import * as __fd_glob_11 from "../content/docs/en/skills/codegen-standards.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/en/roadmap/index.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/en/decisions/turbo-package-manager.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/en/changelog/index.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/zh/template/skill-authoring.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/zh/template/getting-started.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/zh/template/gates.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/zh/roadmap/index.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/zh/decisions/index.mdx?collection=docs"
import * as __fd_glob_2 from "../content/docs/zh/changelog/index.mdx?collection=docs"
import * as __fd_glob_1 from "../content/docs/en/index.mdx?collection=docs"
import * as __fd_glob_0 from "../content/docs/zh/index.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"en/meta.json": __fd_glob_17, "zh/meta.json": __fd_glob_18, "en/changelog/meta.json": __fd_glob_19, "en/roadmap/meta.json": __fd_glob_20, "en/skills/meta.json": __fd_glob_21, "en/template/meta.json": __fd_glob_22, "zh/changelog/meta.json": __fd_glob_23, "zh/decisions/meta.json": __fd_glob_24, "zh/roadmap/meta.json": __fd_glob_25, "en/decisions/meta.json": __fd_glob_26, "zh/template/meta.json": __fd_glob_27, }, {"zh/index.mdx": __fd_glob_0, "en/index.mdx": __fd_glob_1, "zh/changelog/index.mdx": __fd_glob_2, "zh/decisions/index.mdx": __fd_glob_3, "zh/roadmap/index.mdx": __fd_glob_4, "zh/template/gates.mdx": __fd_glob_5, "zh/template/getting-started.mdx": __fd_glob_6, "zh/template/skill-authoring.mdx": __fd_glob_7, "en/changelog/index.mdx": __fd_glob_8, "en/decisions/turbo-package-manager.mdx": __fd_glob_9, "en/roadmap/index.mdx": __fd_glob_10, "en/skills/codegen-standards.mdx": __fd_glob_11, "en/skills/imap-smtp-email.mdx": __fd_glob_12, "en/skills/lesson-prep.mdx": __fd_glob_13, "en/template/gates.mdx": __fd_glob_14, "en/template/getting-started.mdx": __fd_glob_15, "en/template/skill-authoring.mdx": __fd_glob_16, });