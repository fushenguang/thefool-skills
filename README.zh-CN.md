# thefool-skills

中文 | [English](./README.md)

一个**公开的 Agent Skills 内容仓**：skill 正典放在 `skills/<name>/SKILL.md`，
根目录一份任何人都能消费的 `skills.json` manifest，一个文档站，
以及三道从 day one 就装上的 CI 门。

> Generated from the [AgentDock](https://github.com/CogitoTech/agentdock) `skills-registry` template.

**装一个 skill**：manifest 里每条的 `source` + `path` 就是地址，
`git clone --depth 1 <source>` 后取 `<path>` 目录即可——**不需要任何凭据**。

```bash
curl -s https://raw.githubusercontent.com/fushenguang/thefool-skills/main/skills.json
```

## 许可与署名

- 本仓内容为 **MIT**，署名统一归到 [www.fujia.site](https://www.fujia.site)，**允许商用与改编**。
- `lesson-prep` 源自一位一线语文老师的真实备课方法论，**已取得授权**，内容已去标识化。
- **本仓只收我方自有内容。** 第三方许可的 skill（Apache-2.0 / 供应商专有）不放进来——
  它们不是我们能重新许可的东西。这条是硬的，见 `CONTRIBUTING` 之前先读它。

## 技术栈

| 层级       | 技术                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Skill 校验 | [`skills-ref`](https://www.npmjs.com/package/skills-ref)（经 `@cogito.ai/cli`，Agent Skills 规范） |
| 文档       | [Fumadocs](https://fumadocs.dev)（[Next.js 16](https://nextjs.org)）                               |
| 语言       | [TypeScript 5+](https://www.typescriptlang.org)（严格模式）                                        |
| CI 门      | 纯 Node.js ESM 脚本（`scripts/gates/*.mjs`）——零构建步骤                                          |
| 包管理器   | [pnpm](https://pnpm.io) ≥ 9                                                                        |
| 治理       | [OpenSpec](https://github.com/fission-ai/openspec)，仅限基础设施改动                              |
| Monorepo   | [Turborepo](https://turbo.build/repo) + pnpm workspaces                                            |

## 目录结构

```text
skills/
└── <name>/SKILL.md    # 正典内容——这是被发布的东西
skills.json             # 生成的 manifest，提交进 git
apps/
└── docs/               # Fumadocs 站点；content/docs/{en,zh}/skills/* 由 skills.json 生成
packages/                # 共享工具包（eslint-config、tsconfig）
scripts/
├── gates/               # 三道 CI 门
└── gen-skill-docs.mjs   # skills.json → 文档页
boundary-rules.json      # 门③ 的可配置规则表
openspec/                # 治理——只覆盖基础设施/契约改动，不包括「新增一个 skill」
```

## 快速开始

### 1. 前置要求

- Node.js ≥ 18
- pnpm ≥ 9 —— `npm install -g pnpm`
- 本仓库要有一个 git remote（公开的——`skill publish` 会从中推导每条 manifest 的 `source`）

### 2. 安装依赖

```bash
pnpm install
```

### 3. ★ 先跑 bootstrap 命令——这是第一件事

`skill publish` 从**本仓库自己的 git remote** 推导每条 manifest 的 `source`，所以模板没法
预先内置正确的 `skills.json`——它不知道你会把仓库托管在哪。随模板发布的 `skills.json` 里是
占位 `source`。用下面命令填成真的：

```bash
pnpm skills:sync
```

这会把 `skills/` 下每个 skill 重新发布进 `skills.json`（使用你仓库真实的 git remote），并
重新生成 `apps/docs/content/docs/en/skills/` 下的文档页。跑这个之前门② 会一直失败，失败信息
会告诉你该跑什么。

### 3b. ★ 把 `hostPrivateIdentifiers` 填进 `boundary-rules.json`

它**故意留空**——模板不可能知道你宿主项目的名字，瞎猜比诚实留白更糟。留空期间门③ 每次跑都会
打印一条警告：这时候 pass 的含义是"没有东西在找你项目的名字"，不是"确认不存在"。

有实测数据，不是拍脑袋：对着从一个私有 monorepo 抽出来的 14 个真实 skill 跑门③，通用默认值
只抓到 **1** 处对宿主的引用——还漏掉了同一个宿主的另外三种拼法。填完产品名后，命中数从 1 涨到
跨 6 个 skill **35** 处。

### 4. 启动开发

```bash
pnpm dev
```

打开 [http://localhost:3001](http://localhost:3001) 看文档站（默认英文，中文在 `/zh` 下）。

## 新增一个 Skill

新增一个 skill 是内容贡献，不是基础设施改动——**不需要 OpenSpec proposal**。完整的
"什么需要 openspec、什么不需要"对照表见 `AGENTS.md`。

```bash
mkdir -p skills/my-skill
cat > skills/my-skill/SKILL.md <<'EOF'
---
name: my-skill
description: One sentence, in English — this is the field consumers read from the manifest.
license: MIT
---

# My Skill

Body content here.
EOF

agentdock skill validate skills/my-skill   # 本地跑门①
pnpm skills:sync                            # 重新生成 skills.json + 文档
git add skills/my-skill skills.json apps/docs/content/docs/en/skills
git commit -m "feat(skills): add my-skill"
```

开一个 PR。唯一的门是 `agentdock skill validate` 通过 + review。

> **语言提示**：`skills/*/SKILL.md` 必须用英文写——它面向 AI agent 消费，不是给人看的。
> 完整规则见 `AGENTS.md` 的 Language Policy 一节。

## 三道门

本地一次性全跑：

```bash
pnpm gates
```

| 门                | 检查什么                                                          | 什么情况会失败                                                     |
| ----------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| ① 全量校验        | 每个 `skills/*` 是否符合 Agent Skills 规范（`agentdock skill validate`） | 任何一个 skill 不合法——不只是改动过的，防止"A 的改动拖垮了 B"漏检 |
| ② Manifest 新鲜度 | `skills.json` 对比 `skills/*` 的一次新鲜重发布；文档页对比 `skills.json` | 除 `publishedAt`（设计上每次发布都会变）外任何字段不一致           |
| ③ 公私边界        | 所有 git 跟踪文件 vs. `boundary-rules.json` 的规则                 | 私有仓库路径、内部域名、可识别个人信息的模式                       |

每道门的完整细节、失败信息怎么读：`apps/docs/content/docs/zh/template/gates.mdx`。

## 开发

### 常用命令

```bash
pnpm dev              # 启动文档站开发服务器
pnpm build            # 构建所有 workspace 包/应用
pnpm check-types      # TypeScript 检查
pnpm lint             # ESLint
pnpm skills:sync      # 从 skills/ 重新生成 skills.json + 文档
pnpm gates            # 本地跑全部三道 CI 门
```

## 治理（OpenSpec）

本项目使用 [OpenSpec](https://github.com/fission-ai/openspec)，但**只覆盖基础设施/契约改动**——
manifest schema、门的规则、文档结构。新增一个 skill 不走它。见 `openspec/config.yaml` 的
`context` 块与 `AGENTS.md`。

```bash
openspec list                                  # 列出所有 change
openspec status --change <name>                # 查看 change 产物状态
openspec instructions apply --change <name>    # 获取实现指引
```

## 常见问题

**问：我刚跑完 `agentdock init`，什么都还没动，门② 就失败了。**
答：符合预期。先跑第 3 步的 `pnpm skills:sync`——模板自带的 `skills.json` 里是占位
`source`，因为模板没法预先知道你仓库的 git remote。

**问：我改了一个 skill 的 `description`，为什么门② 失败？**
答：`skills.json` 是生成的，不是手工维护的。跑 `pnpm skills:sync` 重新生成它，然后把更新后的
`skills.json` 和 skill 改动一起提交。

**问：为什么新增一个 skill 不需要 OpenSpec proposal？**
答：OpenSpec 只覆盖会改变 manifest schema、门规则、文档结构的改动。新增一个 skill 是在既有契约
内的内容贡献——见 `AGENTS.md` 的对照表。

**问：AI agent 能在这个项目里工作吗？**
答：能——自主边界契约见 `AGENTS.md`。

## 贡献

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org)：

```
feat(skills): add pdf-extraction skill
fix(gates): correct manifest-fresh diff for optional fields
chore: update dependencies
```

Issue 和 PR 英语优先——完整语言规则（skill 只用英文、文档双语、禁止中英混排）见 `AGENTS.md`
的 Language Policy 一节。

## 许可

MIT
