# AGENT.md

## PROJECT

项目名称：

金晗跨境电商管理后台

项目定位：

现代化电商管理后台。

项目风格：

禁止：

- 国产传统 ERP 风格
- Ant Design 老后台风格
- 重表格风格
- 高密度 UI

---

# TECH STACK

必须使用：

- Next.js App Router
- React 19
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Framer Motion
- Recharts

禁止：

- Redux
- MobX
- class component
- SCSS
- Less
- jQuery

---

# UI DESIGN RULES

整体设计：

- 极简
- 卡片化
- 留白充足
- 柔和阴影
- 大圆角
- 高级 SaaS 风格

颜色：

主色：

- #FFB84D
- #F59E0B

辅助色：

- 暖白
- 米黄色
- 奶油色
- 浅绿色

禁止：

- 深蓝企业风
- 传统后台风
- 高密度布局

圆角：

- rounded-2xl
- rounded-xl

阴影：

- shadow-sm
- shadow-md

尽量：

- 卡片化数据展示
- Dashboard 风格
- 可视化优先

---

# PROJECT STRUCTURE

必须严格遵循：

src/

  app/

    (页面路径)/

  features/

    对应页面路径/

  components/

    ui/
    common/
    layout/
    charts/
    
  services/

  stores/

  hooks/

  providers/

  permissions/

  styles/

禁止：

- 巨型 components 文件夹
- utils 地狱
- 所有代码堆在 app/
- 单文件超过 300 行

---

# FEATURE STRUCTURE

每个 feature 必须：

- feature 自闭环
- feature 内聚
- 避免跨 feature 依赖

---

# COMPONENT RULES

组件原则：

- 单一职责
- 可复用
- 可组合

必须：

- 一个组件只做一件事
- props 必须类型安全
- 禁止 any

组件大小：

- 单文件 <= 200 行
- 超过必须拆分

禁止：

- 巨型 JSX
- 巨型 useEffect
- 复杂嵌套三元表达式

---

# SERVER COMPONENT RULES

默认：

- Server Component

只有：

- 表单
- 动画
- 图表
- 交互

才能：

"use client"

禁止：

- 全页面 use client

---

# DATA FETCHING

必须：

- Server First
- TanStack Query 管理客户端缓存

禁止：

- useEffect fetch
- 页面内直接 axios

API 请求：

features/页面路由/api/

示例：

get-product-list.ts
create-product.ts
update-product.ts

禁止：

- api.ts 巨型文件

---

# FORM RULES

必须：

- React Hook Form
- Zod

禁止：

- useState 管理大型表单

表单结构：

schemas/
form/
components/

---

# STATE MANAGEMENT

使用：

- Zustand 管理 UI 状态
- TanStack Query 管理服务端状态

禁止：

- Redux Toolkit
- Context 大范围状态

---

# TABLE RULES

必须：

- TanStack Table

禁止：

- antd table
- 超复杂表格

推荐：

- 卡片化列表
- 混合 Dashboard 布局

---

# CHART RULES

必须：

- Recharts

禁止：

- ECharts

图表风格：

- 极简
- 柔和
- Apple/Stripe 风格

---

# CODE STYLE

必须：

- 函数式编程
- hooks 优先
- early return
- 清晰命名

命名：

组件：

PascalCase

hooks：

useXxx

api：

get-user-list.ts

store：

use-product-store.ts

禁止：

- index.tsx 地狱
- 无意义命名
- util.ts 巨型文件

---

# AI CODING RULES

生成代码时必须：

- 优先可读性
- 优先长期维护
- 优先低耦合
- 优先 feature 架构

禁止：

- 炫技
- 过度抽象
- 复杂设计模式

AI 必须：

- 自动拆分文件
- 自动补全类型
- 自动处理 loading/error/empty
- 自动适配深色模式
- 自动移动端适配

---

# DESIGN STYLE

整体风格：

- Shopify Admin
- Vercel
- Linear
- Stripe Dashboard

动画：

- 微动画
- hover feedback
- 平滑 transition

禁止：

- 花哨动画
- 低端渐变
- 国产运营风

---

# AUTH

推荐：

- Clerk

备选：

- Better Auth
- NextAuth/Auth.js

必须：

- RBAC
- proxy 权限控制

角色：

- admin
- operator
---

# PERFORMANCE

必须：

- 懒加载
- Server Components 优先
- 避免重复渲染

禁止：

- 大量 useMemo/useCallback 滥用
- 客户端 fetch waterfall

---

# OUTPUT RULES

生成代码时：

必须：

- 先生成目录结构
- 再生成页面
- 再生成组件
- 再生成 hooks/store/api

禁止：

- 一次输出超大文件
- 输出不可运行代码
- 输出伪代码

所有代码：

- 必须完整可运行
- 必须 TypeScript 类型完整
- 必须符合 ESLint
- 必须符合 Next.js App Router
