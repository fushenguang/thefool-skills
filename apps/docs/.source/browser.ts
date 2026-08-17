// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"zh/index.mdx": () => import("../content/docs/zh/index.mdx?collection=docs"), "en/index.mdx": () => import("../content/docs/en/index.mdx?collection=docs"), "zh/changelog/index.mdx": () => import("../content/docs/zh/changelog/index.mdx?collection=docs"), "zh/decisions/index.mdx": () => import("../content/docs/zh/decisions/index.mdx?collection=docs"), "zh/roadmap/index.mdx": () => import("../content/docs/zh/roadmap/index.mdx?collection=docs"), "zh/template/gates.mdx": () => import("../content/docs/zh/template/gates.mdx?collection=docs"), "zh/template/getting-started.mdx": () => import("../content/docs/zh/template/getting-started.mdx?collection=docs"), "zh/template/skill-authoring.mdx": () => import("../content/docs/zh/template/skill-authoring.mdx?collection=docs"), "en/changelog/index.mdx": () => import("../content/docs/en/changelog/index.mdx?collection=docs"), "en/decisions/turbo-package-manager.mdx": () => import("../content/docs/en/decisions/turbo-package-manager.mdx?collection=docs"), "en/roadmap/index.mdx": () => import("../content/docs/en/roadmap/index.mdx?collection=docs"), "en/skills/codegen-standards.mdx": () => import("../content/docs/en/skills/codegen-standards.mdx?collection=docs"), "en/skills/imap-smtp-email.mdx": () => import("../content/docs/en/skills/imap-smtp-email.mdx?collection=docs"), "en/skills/lesson-prep.mdx": () => import("../content/docs/en/skills/lesson-prep.mdx?collection=docs"), "en/template/gates.mdx": () => import("../content/docs/en/template/gates.mdx?collection=docs"), "en/template/getting-started.mdx": () => import("../content/docs/en/template/getting-started.mdx?collection=docs"), "en/template/skill-authoring.mdx": () => import("../content/docs/en/template/skill-authoring.mdx?collection=docs"), }),
};
export default browserCollections;