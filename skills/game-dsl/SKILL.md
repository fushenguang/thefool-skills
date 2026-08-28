---
name: game-dsl
license: MIT
description: >-
  游戏 DSL v5 词表手册（2D platformer 规则数据语言）——AI 填数据不写代码：understood
  拆解信封、23 个事件/条件/动作词、逐词反例与陷阱边界。当用户要「用话造关」「把玩法
  需求写成规则数据 / rules.ts 数据层」，或项目里出现 game-dsl-handbook 时激活。只管规则层：
  不做关卡布局、美术与代码生成。
metadata:
  version: "5.0.0"
  thefool.channel: official
---

# 游戏规则语言 v5 · 词表手册

<!-- v5 = v4（M14 信封 + M15 整句 + M16 两处措辞，均已实测采纳）+ 第 6 轮路径 A 加词（能力类 #3 解冻第一刀）：① 新增条件词 SCORE_IS_AT_LEAST（读取分数当前值的持续状态条件）；② SCORE_REACHES 词条的边界文案随之改写（事件 vs 状态）；③ 错误五反例同步更新（变更纪律：加词必须同步更新邻词反例）。22 词 → 23 词。 -->

你要为一个 2D 平台跳跃（platformer）游戏产出**规则数据**。你不写代码，只填数据。

## 规则的骨架

### 输出信封（无论产出什么，形状恒定）

**第一步永远是拆解**：把需求拆成几件独立的事，逐条写进 `understood`，然后才决定产出什么。

```json
{
  "understood": [
    { "clause": "需求拆出的第一件事，用原文或最近似的转述", "can": true },
    { "clause": "需求拆出的第二件事", "can": false }
  ],
  "verdict": "all 或 partly 或 none",
  "rules": [
    {
      "id": "小写英文与连字符组成的名字",
      "when":    { "event": "事件词", "……事件参数": "……" },
      "only_if": [ { "condition": "条件词", "……条件参数": "……" } ],
      "then":    [ { "action": "动作词", "……动作参数": "……" } ]
    }
  ]
}
```

`understood` / `verdict` 的规矩：

1. `clause` 写需求里**一件独立的事**，用原文或最近似的转述，不许合并多件事、不许漏掉任何一件。
2. `can` 的判据：本手册的词能不能**完整**表达这一条——**一个字都不含糊才算能**。差一点（参数没有、状态读不到、时间表达不了）都是 `false`。
3. `verdict`：所有条 `can: true` ⇒ `"all"`；一部分能 ⇒ `"partly"`；都不能 ⇒ `"none"`。`verdict` 必须与 `understood` 一致。
4. `verdict` 是 `"all"` ⇒ 后面必须是 `rules`（可选 `suggested_extras`）。`verdict` 是 `"partly"` 或 `"none"` ⇒ 后面必须是 `cannot_express`，**不许给 `rules`**。
5. `cannot_locate`（反馈落不到规则上）的输出同样以 `understood` 开头，把反馈要定位的点逐条拆出来。

**只产出一条规则时也必须放进 `rules` 数组里。不许裸输出一个规则对象。**
顶层允许出现的键只有：`understood`、`verdict`、`rules`、`suggested_extras`、`cannot_express`、`cannot_locate`。没列出的键一律不许出现。

### 每一条规则的骨架

**必须且只能有这四个字段，顺序固定**：`id` → `when` → `only_if` → `then`。

规矩（违反任何一条即为错误）：

1. 四个字段**一个都不能省略**。没有条件时 `only_if` 必须写 `[{"condition":"ALWAYS"}]`，不能留空数组、不能不写。
2. `when` 只能有**一个**事件。需要两个事件就写两条规则。
3. `only_if` 是数组，每一项是一个对象：`condition` 键写条件词，参数写在同一个对象里。多个条件之间是**并且**的关系。**不许写裸字符串。**
4. `then` 是数组，按数组顺序依次执行。
5. 只能使用本手册列出的词。**手册里没有的词一律不许发明。**
6. 所有词都是全大写加下划线。参数名都是全小写加下划线。

## 做不到的时候怎么办 —— 分两种，不许混

**第一种：缺词。** 你要表达的东西**用本手册的词表达不出来**。
不要硬凑，不要用意思相近的词代替。输出：

```json
{
  "cannot_express": true,
  "reason": "一句话说明缺什么词、为什么现有的词表达不了",
  "requested_words": [
    { "id": "你建议新增的词", "category": "event 或 condition 或 action", "why": "它要表达什么" }
  ]
}
```

🔴 **「一半能表达、一半表达不了」的需求要整条拒绝。** 如果需求里有**一部分**你能用本手册的词完整表达、**另一部分**表达不了，**不许只做能做的那部分然后交差**——那样产出的规则看起来正确，实际上悄悄丢掉了另一半需求，而且没有任何报告。正确动作：`understood` 里逐条标好 `can`，`verdict` 给 `"partly"` 或 `"none"`，然后输出上面的 `cannot_express`。**不许带 `rules`。** `reason` 只需要一句话说明缺什么词——哪一半能、哪一半不能，`understood` 已经写清楚了，不必在 `reason` 里重复。

**第二种：信息不足。** 词是够的，但**给你的反馈无法落到给定的这条规则上**——
比如玩家说"玩不通"但没说哪里、给定的规则本身看不出毛病。
**这种时候绝对不要随便改点什么交差。** 输出：

```json
{
  "cannot_locate": true,
  "reason": "为什么这条反馈落不到这条规则上",
  "need_to_know": ["为了定位，你还需要知道的具体信息，逐条列出"]
}
```

🔴 **这两种必须分开**：缺词要走加词流程，信息不足要回去问人。
一条结构正确的规则，在没有额外信息时**不许凭空"修正"**——那只是编造改动，不是修复。

---

## 一、实体种类（entity kind）

关卡里能放的东西只有这 6 种。**实体本身不产生任何因果**——尖刺不会自己扎人，
弹簧不会自己弹人，所有因果都必须由规则写出来。

| 词 | 含义 | 参数 |
|---|---|---|
| `PLAYER` | 玩家控制的角色。每关有且只有一个。 | 无 |
| `SOLID` | 四面都不可穿过的实心块。玩家可以站在它上面。 | `width_tiles`（1–64）、`height_tiles`（1–64） |
| `SPRING` | 弹簧本体。占 1×1 格。**它自己不产生弹起效果。** | 无 |
| `HAZARD` | 危险物本体（尖刺、岩浆等）。**它自己不产生伤害。** | `width_tiles`（1–64）、`height_tiles`（1–64） |
| `COLLECTIBLE` | 可拾取物本体（金币等）。占 1×1 格。**拾取后果由规则决定。** | `value`（0–999） |
| `GOAL` | 终点本体。占 1×1 格。**过关由规则决定。** | 无 |

## 二、事件（event）—— 只能出现在 `when`

### `LEVEL_STARTS`
一关开始，在玩家获得控制权之前触发一次。
- 参数：无。
- 前置：无。

### `PLAYER_TOUCHES`
玩家的碰撞箱与某种实体的碰撞箱在本帧**开始重叠**。任何方向的接触都算：从上方踩到、从下方顶到、从侧面撞到，都会触发。
- 参数：`what` —— 字符串。可以是上面 6 个实体种类词之一，也可以是一个 archetype 的 id（小写英文与连字符）。
- 🔴 `what` **不能是 `PLAYER`**。玩家不会碰到自己。需要表达玩家自身的主动行为
  （跳跃、攻击、二段跳）时，本手册没有对应的事件词，应当输出 `cannot_express`。
- 前置：无。

### `PLAYER_LANDS_ON`
玩家在本帧**从空中落到某种实体的上表面**。侧面撞到不算，从下方顶到不算。
- 参数：`what` —— 同 `PLAYER_TOUCHES`。
- 前置：无。

### `PLAYER_LEAVES_WORLD`
玩家越出关卡世界边界之外。
- 参数：无。
- 前置：无。

### `SCORE_REACHES`
分数在本帧**首次**达到或超过某个值。同一关内同一个值只会触发一次。
- 参数：`amount` —— 整数，−9999 到 9999。
- 前置：无。
- 🔴 **它是一个事件，不是一个状态。** 它只在分数首次到达那一帧触发一次，之后不再为真。
  需求是「分数一到 N **那一刻**就做某事」时用它；需求是「分数 ≥ N **期间/前提下**
  才允许某事」时，用条件词 `SCORE_IS_AT_LEAST`，不要用本事件。

## 三、条件（condition）—— 只能出现在 `only_if`

### `ALWAYS`
恒为真。**没有条件时必须写它**，不能省略 `only_if`。

### `PLAYER_IS_FALLING`
玩家的垂直速度方向向下，**并且**不站在任何实体上。
- 上升过程中为**假**。
- 站在地面或平台上为**假**。
- 不包含任何关于生命、伤害、死亡的含义。

### `PLAYER_IS_AIRBORNE`
玩家不站在任何实体上。**上升过程中也为真**，下落过程中也为真。

### `PLAYER_IS_ON_GROUND`
玩家正站在某个实体的上表面。与 `PLAYER_IS_AIRBORNE` 互斥。

### `SCORE_IS_AT_LEAST`
规则求值时刻，**分数的当前值 ≥ `amount`**。是一个持续状态：分数在阈值之上的每一帧它都为真；分数降回阈值之下后为假，之后再次升上来又为真。
- 参数：`amount` —— 整数，−9999 到 9999。必填。
- 这里的「分数」指 `ADD_SCORE` 所修改、`SCORE_REACHES` 所观察的**同一个本关分数计数器**，不是任何别的计数（连击数、死亡次数、金币出现个数都不是它）。
- 🔴 它是 condition，只能出现在 `only_if`。它**不触发任何事**——「分数一到 N 那一刻就做某事」要用事件 `SCORE_REACHES` 写在 `when`。
- 它**只回答「现在够不够」**，不记录「凑的过程」（连续、累计几次、隔多久清零都表达不了），也不关心分数是怎么来的。需要计数过程语义时输出 `cannot_express`。

## 四、动作（action）—— 只能出现在 `then`

### `LAUNCH_PLAYER`
把玩家的垂直速度设为向上，使其在无外力干预时上升到指定高度后开始下落。
**它覆盖玩家当前的垂直速度，不与之叠加。**
- 参数：`height_tiles` —— 数字，0.5 到 20.0。必填。

### `KILL_PLAYER`
玩家进入死亡状态：失去控制权，播放死亡表现。**它不会自动重生玩家。**
- 参数：无。

### `RESPAWN_PLAYER`
把玩家放回本关的出生点并恢复控制权。
- 参数：无。

### `ADD_SCORE`
分数增加指定值。可以为负数（即减分）。
- 参数：`amount` —— 整数，−9999 到 9999。必填。

### `REMOVE_ENTITY`
把触发本次事件的那个实体从关卡里移除。
- 参数：`target` —— 只能是字符串 `"TRIGGERING_ENTITY"`。必填。

### `COMPLETE_LEVEL`
本关判定为通过，进入下一关。
- 参数：无。

### `PLAY_SOUND`
播放一个音效。
- 参数：`sound_id` —— 字符串，小写英文与连字符。必填。

## 五、容易混淆的词，它们的区别

| 这两个词 | 区别 |
|---|---|
| `PLAYER_TOUCHES` / `PLAYER_LANDS_ON` | 前者任何方向接触都触发；后者只有**从空中落到上表面**才触发。 |
| `PLAYER_IS_FALLING` / `PLAYER_IS_AIRBORNE` | 上升过程中：AIRBORNE 为真，FALLING 为假。 |
| `KILL_PLAYER` / `RESPAWN_PLAYER` | `KILL_PLAYER` 只让玩家死，**不会重生**。要让玩家重新开始必须两个都写。 |
| `SCORE_REACHES` / `SCORE_IS_AT_LEAST` | 前者是**事件**：分数首次到达 N 的那一帧触发一次，写在 `when`。后者是**状态**：此刻分数 ≥ N 恒成立与否，写在 `only_if`。「一到 20 分就通关」用前者；「分数满 3 个时碰终点才算通关」用后者。 |

## 六、错误用法示例

**错误一**：省略 `only_if`
```json
{ "id": "goal-completes-level",
  "when": { "event": "PLAYER_TOUCHES", "what": "GOAL" },
  "then": [ { "action": "COMPLETE_LEVEL" } ] }
```
→ 缺 `only_if`。正确写法要补上 `"only_if": [{"condition":"ALWAYS"}]`。

**错误二**：用 `PLAYER_IS_FALLING` 表达"玩家死了"
```json
{ "only_if": [ { "condition": "PLAYER_IS_FALLING" } ] }
```
→ `PLAYER_IS_FALLING` 只说速度方向，不含任何生命状态含义。手册里没有表达"玩家已死"的条件词，遇到这种需求应当输出 `cannot_express`。

**错误三**：只写 `KILL_PLAYER` 就以为玩家会重来
```json
{ "then": [ { "action": "KILL_PLAYER" } ] }
```
→ `KILL_PLAYER` 不会重生。要重来必须写 `[{"action":"KILL_PLAYER"},{"action":"RESPAWN_PLAYER"}]`。

**错误四**：用 `what: "PLAYER"` 表达玩家自己的动作
```json
{ "when": { "event": "PLAYER_TOUCHES", "what": "PLAYER" }, "only_if": [ { "condition": "PLAYER_IS_AIRBORNE" } ],
  "then": [ { "action": "LAUNCH_PLAYER", "height_tiles": 4 } ] }
```
→ 玩家不会碰到自己。这条规则语法合法但语义荒谬。表达玩家主动行为应当输出 `cannot_express`。

**错误五**：把「分数门槛」写成 SCORE_REACHES 直接触发
```json
{ "when": { "event": "SCORE_REACHES", "amount": 3 }, "only_if": [ { "condition": "ALWAYS" } ],
  "then": [ { "action": "COMPLETE_LEVEL" } ] }
```
→ 这条规则实现的是「分数一到 3 **就直接通关**」。如果需求是「分数满 3 时**碰终点**
才算通关」，正确写法是把门槛放进 `only_if`，触发仍然由碰终点驱动：

```json
{ "id": "goal-needs-three-coins",
  "when": { "event": "PLAYER_TOUCHES", "what": "GOAL" },
  "only_if": [ { "condition": "SCORE_IS_AT_LEAST", "amount": 3 } ],
  "then": [ { "action": "COMPLETE_LEVEL" } ] }
```

如果需求是「吃满 3 个金币，**终点才会出现**」——那是实体显隐，本手册表达不了，
仍然输出 `cannot_express`。

**错误六**：用空操作绕过表达力不足
```json
{ "then": [] }                                    // 空的 then
{ "then": [ { "action": "ADD_SCORE", "amount": 0 } ] }   // 拿 0 当空操作
```
→ `then` 至少要有一个真正会产生效果的动作。表达不了就输出 `cannot_express`，
不要造一条什么都不做的规则来交差。

**错误七**：发明手册里没有的词
```json
{ "then": [ { "action": "PLAY_ANIMATION", "clip": "die" } ] }
```
→ `PLAY_ANIMATION` 不在手册里。不许发明，应当输出 `cannot_express`。

**错误八**：需求只实现一半就交差（最危险的错误）
```json
// 需求：尖刺每 2 秒伸出、再缩回一次；缩回去的时候踩上去没事
{ "id": "hazard-always-deadly",
  "when": {"event":"PLAYER_TOUCHES","what":"HAZARD"},
  "only_if": [{"condition":"ALWAYS"}],
  "then": [{"action":"KILL_PLAYER"},{"action":"RESPAWN_PLAYER"}] }
```
→ 这条规则**完全合法、语义也没错**，但它把「每 2 秒伸出缩回」那一半需求**悄悄丢掉了**，而且不报告。产出的规则越正确，这种不完整越难被发现。只要需求里有一部分表达不了，就必须整条输出 `cannot_express`，并在 `reason` 里指明哪一半能做、哪一半不能做。

## 七、一个完整的正确例子

需求：分数达到 20 分时通关，并播放胜利音效。

```json
{
  "understood": [
    { "clause": "分数达到 20 分时通关", "can": true },
    { "clause": "播放胜利音效", "can": true }
  ],
  "verdict": "all",
  "rules": [
   {
  "id": "score-twenty-completes-level",
  "when":    { "event": "SCORE_REACHES", "amount": 20 },
  "only_if": [ { "condition": "ALWAYS" } ],
  "then": [
    { "action": "PLAY_SOUND", "sound_id": "victory" },
    { "action": "COMPLETE_LEVEL" }
  ]
   }
  ]
}
```

## 输出要求

**只输出一个 JSON 对象，不要任何解释文字，不要 markdown 代码围栏。**

🔴 **所有说明文字（`clause`、`reason`、`why`、`need_to_know`、`suggested_extras`）里引用任何词语、原文，一律用中文引号「」，禁止使用 ASCII 双引号 `"`。** 未转义的 `"` 会破坏整个 JSON 的合法性。

每个输出的第一个键都是 `understood`，第二个键都是 `verdict`，然后是 `rules`（+可选 `suggested_extras`）、`cannot_express`、`cannot_locate` 三者之一。

🔴 **`then` 的取舍判据只有一条：这个动作在需求原文里有对应的字吗？**

- **有** ⇒ 必须写进 `then`，一个都不能少。包括"然后…""并且…""接着…"引出的后续动作。
- **没有** ⇒ 不许写进 `then`（音效、移除实体、加分等）。你认为该补的写进顶层
  `suggested_extras` 数组，每项一句话。
