---
name: codegen-standards
license: MIT
description: 编码标准与项目初始化规范。自动注入到每个 Cowork 会话中，提供语言选择决策树、项目初始化命令模板和禁止事项。
metadata:
  thefool.channel: official
  thefool.autoInject: true
---

# 编码规范（Codegen Standards）

本 Skill 在 Cowork 编码会话中自动生效，无需手动选择。

## 语言选择决策树

当用户请求涉及编写代码时，按照以下优先级选择语言：

| 任务类型 | 语言 | 优先级 |
|---------|------|--------|
| 数据分析、机器学习、科学计算 | Python | P1 |
| 系统脚本、自动化、CI/CD | Shell (bash/zsh) | P0 |
| Web 开发、API、CLI 工具、其他 | TypeScript | P0 |

**决策流程：**
1. 用户明确指定语言 → 使用用户指定的语言
2. 任务涉及数据分析/ML/科学计算 → Python
3. 任务是系统脚本/文件操作/自动化 → Shell
4. 其他所有开发任务 → TypeScript

## TypeScript 项目初始化（pnpm monorepo）

当需要创建 TypeScript 项目时，执行以下命令：

**首次初始化 monorepo（`code/ts/` 不存在时）：**
```bash
# 1. 创建 monorepo 根目录
mkdir -p code/ts
cd code/ts

# 2. 初始化 pnpm workspace
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
EOF

# 3. 初始化根 package.json
pnpm init
# 修改 package.json 添加 "private": true

# 4. 创建子包
mkdir -p packages/{project-name}/src
cd packages/{project-name}
pnpm init

# 5. 初始化 tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true
  },
  "include": ["src"]
}
EOF
```

**在已有 monorepo 中创建新子包：**
```bash
cd code/ts
mkdir -p packages/{project-name}/src
cd packages/{project-name}
pnpm init
# 复制或创建 tsconfig.json
```

**多包项目（如 backend + frontend）：**
```bash
# 每个组件都是独立子包，放在 packages/ 下
cd code/ts
mkdir -p packages/{project-name}-backend/src
mkdir -p packages/{project-name}-frontend/src
# 分别初始化
# 禁止直接在 code/ts/ 下创建 backend/ 或 frontend/ 等目录
```

**检查已有项目（执行前必做）：**
```bash
# 检查 monorepo 是否存在
test -f code/ts/pnpm-workspace.yaml && echo "monorepo exists"
# 检查子包是否存在
test -f code/ts/packages/{project-name}/package.json && echo "package exists"
```

## Python 项目初始化（uv）

当需要创建 Python 项目时，执行以下命令：

**使用 uv（推荐）：**
```bash
# 1. 检查 uv 是否可用
command -v uv >/dev/null 2>&1 || { echo "uv not found. Install: curl -LsSf https://astral.sh/uv/install.sh | sh"; exit 1; }

# 2. 创建项目
mkdir -p code/py
cd code/py
uv init {project-name}
cd {project-name}

# 3. 创建虚拟环境并安装依赖
uv sync
```

**uv 不可用时的降级方案：**
```bash
mkdir -p code/py/{project-name}
cd code/py/{project-name}
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

**检查已有项目（执行前必做）：**
```bash
test -f code/py/{project-name}/pyproject.toml && echo "project exists"
```

## Shell 脚本约定

- 脚本放置在项目的 `scripts/` 目录下
- 使用 `#!/usr/bin/env bash` 作为 shebang
- 创建后设置执行权限：`chmod +x scripts/{script-name}.sh`

```bash
# Shell 脚本模板
cat > scripts/{script-name}.sh << 'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

# 脚本描述

SCRIPT
chmod +x scripts/{script-name}.sh
```

## 禁止事项

- **禁止** 在工作区根目录直接创建项目（必须放在 `code/ts/` 或 `code/py/` 下）
- **禁止** 在 `code/ts/` 下直接创建项目目录（如 `backend/`、`frontend/`），所有项目必须放在 `code/ts/packages/` 下
- **禁止** 在 `uv` 可用时使用 `pip install`（应使用 `uv add`）
- **禁止** 在同一任务中无理由地混合多种语言
- **禁止** 跳过"检查已有项目"步骤直接初始化（防止覆盖已有配置）
- **禁止** 使用 `npm` 初始化 TypeScript 项目（应使用 `pnpm`）
