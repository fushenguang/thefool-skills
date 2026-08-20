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
metadata:
  version: "1.0.0"
---

# My Skill

Body content here.
EOF
```

> **语言提示**：`skills/*/SKILL.md` 必须用英文写——它面向 AI agent 消费，不是给人看的。
> 完整规则见 `AGENTS.md` 的 Language Policy 一节。

文件写完之后就该发布了——完整、已验证的流程见下一节。

## 发布一个 Skill

这是从"我写好了一份 `SKILL.md`"到"它已经出现在
[fujia.site/skills](https://www.fujia.site/skills) 和桌面端技能市场里"的真实路径。下面每一条
命令都是写这份指南时实际跑过、见过输出的。

### 1. 前置条件

- Node.js ≥ 18（在 Node 24 上验证过）
- 不需要提前安装任何东西——全程走 `npx`，按需拉取 CLI
- CLI 包：[`@cogito.ai/cli`](https://www.npmjs.com/package/@cogito.ai/cli)。始终以
  `npx @cogito.ai/cli@latest ...` 的形式调用——**当前发布版本是 `0.15.0`**。不要依赖本仓库
  `devDependencies` 里锁定的那个版本（更旧）；原因见下面的"已知限制"。

```bash
npx @cogito.ai/cli@latest --version
# 0.15.0
```

### 2. 登录

```bash
npx @cogito.ai/cli@latest auth login     # 打开浏览器走 OAuth 流程
npx @cogito.ai/cli@latest auth status    # 确认已登录
npx @cogito.ai/cli@latest auth logout    # 登出
```

`auth status` 会打印一行状态（字段已裁剪示例）：

```json
{"event":"status","signedIn":true,"provider":"thefoolai","userId":"...","displayName":"...","savedAt":"..."}
```

⚠️ **已知限制——登录凭据会静默过期。** 登录凭据有效期 **24 小时**。过期后 `auth status`
**仍会显示 `signedIn: true`**——它只读本地凭据文件，不会向服务端校验 token。你不会从
`auth status` 那里得到提示；你会发现的方式是：`skill publish` 的索引步骤（见下面第 5 步）
静默降级成一条 warning，而不是报错失败。如果发布看起来成功了，但网站上一直看不到这个 skill，
先重新 `auth login`，再重跑 `skill publish`。（登记为债：`cli-auth-token-expires-silently`。）

### 3. `SKILL.md` 的字段要求

`skill publish` 会读取以下 frontmatter 字段：

| 字段                | 必填 | 说明                                                              |
| ------------------- | ---- | --------------------------------------------------------------- |
| `name`              | 是   | 与目录名一致                                                      |
| `description`       | 是   | 一句话，英文——这是消费方从 manifest 里读到的字段                  |
| `license`           | 是   | 如 `MIT`                                                         |
| `metadata.version`  | 是   | **必须是合法的 [semver](https://semver.org)**（如 `"1.0.0"`）——否则发布会被拒 |

本仓库的 `skills/format-markdown/SKILL.md` 是一个真实的、当前已发布的 skill——照它对字段，
别自己瞎猜。

### 4. 校验

```bash
npx @cogito.ai/cli@latest skill validate skills/<name>
# ✓ skills/<name> is a valid skill
```

### 5. 发布

```bash
npx @cogito.ai/cli@latest skill publish skills/<name> --registry .
# ✓ Updated "<name>" in skills.json
```

`--registry` 指的是**本地 registry git checkout 的根目录**——对本仓库来说就是仓库根目录本身
（`.`），因为本仓库自己就是这个 registry（`skills.json` 就放在这里）。

发布会做两件事：

1. **写/更新本地 `skills.json` 的 manifest 条目**——无论是否登录都会做。本地发布不依赖后端，
   这是刻意的可移植性设计。
2. **如果你已登录**，还会把这条目索引进托管 registry（`POST /api/skills/publish`），
   这样才会出现在网站和桌面端里。

需要知道的边界：

- **未登录** → 只发生第 1 步。不会发请求，也不会报错。
- **已登录但索引失败或超时** → `skills.json` 照样写入；你会收到一条警告而不是硬失败，
  CLI **不会**重试。

manifest 条目会带上 `version`（来自 `SKILL.md` 的 `metadata.version`）和 `author`（来自你的
登录身份）。对着 `format-markdown` 的一次真实发布做 diff，可以确认这点：

```diff
       "path": "skills/format-markdown",
       "license": "MIT",
-      "publishedAt": "2026-08-19T12:44:36.922Z"
+      "version": "1.0.0",
+      "author": { "id": "...", "name": "..." },
+      "publishedAt": "2026-08-20T09:23:25.725Z"
```

**推荐：发布时带上 `--json`**——这是确认"到底发生了什么"最可靠的方式（见第 6 步）：

```bash
npx @cogito.ai/cli@latest skill publish skills/<name> --registry . --json
```

### 6. 确认它真的上线了

**别拿网页的 HTTP 状态码当证据——它什么都证明不了。**
`https://www.fujia.site/skills/<skill-id>` 是一个客户端渲染的 SPA 路由：不管 id 是真是假，
它都会返回 `200`，并且不管哪种情况都会把这个 id 原样回显进那份还没渲染的 shell HTML 里。
实测验证过：对一个真实存在的 skill 和一个瞎编的 id（`skills/zzz-does-not-exist-999`）分别
发请求做 diff，两边拿到的都是 `200`、内容基本一样的空壳——真正的 skill 数据是之后在客户端
才加载出来的，所以 `curl`（或任何只看状态码的检查）根本分不清这两种情况。而且 web 侧也没有
一个能直接 `GET` 到 skill 详情的纯 REST 接口——走的是 TanStack 的 `createServerFn`，不是
`curl` 能直接查询的路由。

**首选判据——看 `skill publish --json` 自己报告了什么。** 它的 JSON 结果才是事实源
（字段语义已去读 CLI 自己的源码确认过——`agentdock` 仓的 `skillPublish.ts` /
`registryIndex.ts`——不是从字段名猜的）：

- `"indexed": true` → 这条已经进了托管 registry——网站和桌面端都能看到。
- `"indexed": false` 且 `"anonymous": true` → 你没登录。根本没发请求到服务端，只写了本地
  `skills.json`。登录后重新发布。
- `"indexed": false` 且 `"anonymous": false` → 已登录，但索引请求本身失败了（响应异常、
  超时、或网络错误）——CLI 从不重试。按上面"已知限制"的说法，最可能的原因就是 token 过期：
  重新 `auth login`，再重新发布一次。
- `"updated"`——`true` 表示替换了一个同 id 的既有条目（幂等重发布），`false` 表示新建了一条。
- `"versionMissing"`——只有当 `SKILL.md` 里**完全没有** `metadata.version` 时才是 `true`。
  版本**格式不对**（非法 semver）会在更早的地方就被拒绝，导致整次发布直接失败，根本走不到
  这个字段。

**次选、人工判据——真的去看那个页面。** 用浏览器打开
`https://www.fujia.site/skills/<skill-id>`，确认页面上真的渲染出了这个 skill 的名称、
描述、以及"未经扫描"的安全标注——而不只是"页面能打开"。

桌面端：同样去 app 内的技能市场里找这条真实条目，而不只是"app 能打开"。

### 7. 提交 manifest

manifest 是本仓库的真源，所以要 commit + push——这**不会**再次触发索引，索引在第 5 步就已经
发生了：

```bash
git add skills/my-skill skills.json
git commit -m "feat(skills): add my-skill"
git push
```

没有直接 push 权限就开一个 PR。唯一的门是 `skill validate` 通过 + review。

### 已知限制

- **`repo-root-skill-cannot-be-indexed`**——把 skill 直接放在仓库根目录（不放在
  `skills/<name>/` 下）目前无法被索引，发布会收到一个缺 `path` 的错误。skill 必须放在
  `skills/<name>/` 下。
- **CLI 版本门槛**——`<= 0.14.0` 的 CLI 版本无法发布到托管 registry，会收到 `HTTP 426`。
  始终用 `npx @cogito.ai/cli@latest`（或锁定 `>= 0.15.0`），不要依赖某个项目
  `devDependencies` 里锁的版本。

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

**问：我跑了 `skill publish`，提示"Updated"，但网站上看不到这个 skill。**
答：大概率是登录 token 过期了——`auth status` 不会向服务端校验 token，所以过期的 token 照样
显示 `signedIn: true`。重新 `auth login`，再重跑一次 `skill publish`。见"发布一个 Skill"
第 2 步。

**问：我的 skill 放在仓库根目录，不在 `skills/<name>/` 下——发布报了一个 `path` 相关的错误。**
答：这是已知限制，不是你的配置问题——索引器目前要求 skill 必须放在 `skills/<name>/` 下。
把它挪过去，重新发布即可。

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
