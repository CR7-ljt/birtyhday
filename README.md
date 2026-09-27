# PM Proof Portfolio

一个面向产品经理求职的「作品集 + 可交互产品 Demo」网站。项目通过 AI 客服 SaaS 后台 Demo 展示从问题定义、用户验证到交付和复盘的产品能力。

## 技术栈

- Next.js 14（App Router）+ TypeScript
- Tailwind CSS
- Framer Motion（已纳入依赖，可用于扩展页面转场）
- Lucide React
- next-themes（默认跟随系统的亮/暗主题）
- 本地 JSON Mock 数据；无需后端，可直接部署到 Vercel

## 页面与路由

| 路由 | 内容 |
| --- | --- |
| `/` | 首页：价值主张、能力地图、精选案例与联系入口 |
| `/demo` | AI 客服 SaaS 可交互后台 |
| `/cases` | 案例列表 |
| `/cases/[slug]` | 结构化案例详情 |

## Demo 交互

1. **概览**：在 7 日与 30 日指标间切换，指标卡和趋势柱状图同步变化。
2. **知识库**：新增条目后即时加入列表，并给出保存成功 Toast。
3. **对话质检**：按会话状态筛选，或按客户/主题关键词搜索。
4. **AI 工作流**：切换配置 Tab 触发加载态；调整人工转接置信度阈值并保存。

## 数据替换

- `data/cases.json`：案例的背景、研究、方案、指标和复盘。
- `data/demo.json`：Demo 内的会话、知识库与仪表盘数据。
- `app/page.tsx`：姓名、联系方式和首页能力标签。

所有示例指标均为演示数据。投递前请替换为可验证的真实项目事实，并用自己的头像、简历文件和联系方式替换占位信息。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

生产验证与启动：

```bash
npm run build
npm run start
```

如果你偏好 pnpm，也可以使用 `pnpm install && pnpm dev`；当前项目已用 npm 完成依赖安装和构建验证。

## Vercel 部署

1. 将仓库推送至 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 导入仓库。
3. Framework Preset 选择 Next.js（通常会自动识别）。
4. Build Command 使用 `npm run build` 或 Vercel 自动识别的 Next.js 默认配置，点击 Deploy。

## 设计决策

- **静态优先**：案例与初始 Demo 数据位于本地 JSON，保证加载稳定、避免接口依赖。
- **Build > Tell**：Demo 不是截图，而是基于客户端状态的可操作后台，刻意覆盖筛选、提交反馈、加载态和配置保存。
- **B 端表达**：采用侧边栏、指标卡、状态标签、筛选和工作流配置等高频企业组件，说明对信息架构与运营流程的理解。
- **可访问性**：使用语义化页面结构、原生输入控件和可获得焦点的按钮；颜色不是唯一的信息表达方式。
- **性能**：不依赖远程图片或后端；页面以 Server Component 为主，只有交互控制台和主题模块运行在客户端。
