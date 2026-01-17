# wzly (VuePress 文档站点)

这是一个基于 VuePress v2（Vite bundler）的个人文档 / 博客站点项目，用于“记录生活，分享知识”（项目内描述：记录开发历程）。

站点源码主要放在 `docs/` 下，通过 `@vuepress/plugin-blog` 将 `docs/posts/` 下的 Markdown 文章聚合为「文章 / 分类 / 标签 / 时间线」等页面，并使用 `docs/.vuepress/layouts/` 中的自定义布局进行渲染。

## 技术栈

- VuePress: `vuepress@2.0.0-rc.20`
- Bundler: `@vuepress/bundler-vite`
- Theme: `@vuepress/theme-default`
- Blog: `@vuepress/plugin-blog`
- Vue: `vue@3`

## 本地开发

建议 Node.js 版本：

- CI / GitHub Actions 使用 Node `22`（见 `.github/workflows/deploy-docs.yml`）
- 本地建议使用 Node `18+`（VuePress v2 的常见运行要求），或与 CI 保持一致使用 Node 22

安装依赖：

```bash
npm ci
```

启动开发服务器：

```bash
npm run docs:dev
```

构建静态站点：

```bash
npm run docs:build
```

清理缓存并启动（遇到缓存/热更新异常时使用）：

```bash
npm run docs:clean-dev
```

更新 VuePress 相关依赖（使用官方 `vp-update` 工具）：

```bash
npm run docs:update-package
```

## 目录结构

核心目录说明（按使用频率排序）：

```text
.
├─ docs/                         # 站点内容根目录（VuePress source dir）
│  ├─ README.md                  # 首页（frontmatter: home/hero/features 等）
│  ├─ get-started.md             # 示例页面
│  ├─ posts/                     # 博客文章目录（被 blogPlugin 识别为文章）
│  │  ├─ mobile-h5.md
│  │  └─ article-error-code.md
│  └─ .vuepress/                 # VuePress 配置与主题增强
│     ├─ config.js               # 站点配置（标题、导航、插件等）
│     ├─ client.js               # 客户端增强入口（如需）
│     ├─ components/             # 自定义组件（可在 Markdown 中直接使用）
│     │  └─ ArticleList.vue
│     ├─ layouts/                # 配合 blogPlugin 的自定义布局
│     │  ├─ Article.vue
│     │  ├─ Category.vue
│     │  ├─ Tag.vue
│     │  └─ Timeline.vue
│     ├─ .temp/                  # 开发/构建时生成（自动生成，不建议手工修改）
│     └─ .cache/                 # 构建缓存（自动生成）
├─ .github/workflows/
│  └─ deploy-docs.yml            # 构建并部署到 gh-pages 的 GitHub Actions
├─ package.json                  # 脚本与依赖
├─ package-lock.json             # npm lockfile
├─ node_modules/                 # 依赖安装产物（本地生成）
├─ openspec/                     # OpenSpec 相关（本仓库的协作/规范说明）
└─ AGENTS.md                     # 给 AI 助手的项目说明入口
```

## 内容与路由约定

- `docs/README.md` 会作为站点首页（`/`）。
- `docs/posts/` 下的 Markdown 文件会被 `@vuepress/plugin-blog` 作为“文章”处理。
- 站点导航在 `docs/.vuepress/config.js` 中配置，包含：
  - `/article/`：文章列表
  - `/category/`：分类聚合
  - `/tag/`：标签聚合
  - `/timeline/`：时间线（依赖文章 `frontmatter.date`）

提示：时间线配置当前使用了 `page.frontmatter.date instanceof Date` 作为过滤条件；如果你在文章里使用字符串日期（例如 `date: 2026-01-01`），可能不会进入 timeline，需要配合 VuePress 的 frontmatter date 解析行为检查/调整。

## 部署（GitHub Pages）

本项目内置 GitHub Actions 工作流：`.github/workflows/deploy-docs.yml`

- 触发：`main` 分支 push
- 流程：`npm ci` -> `npm run docs:build` -> 部署 `docs/.vuepress/dist` 到 `gh-pages` 分支
- 额外：构建后会写入 `docs/.vuepress/dist/.nojekyll`，避免 GitHub Pages 的 Jekyll 处理干扰

## 常见注意事项

- `docs/.vuepress/.temp/`、`docs/.vuepress/.cache/`、`node_modules/` 都是本地生成目录，通常不建议提交到 git。
- 如果你准备把这个仓库作为长期维护的文档站，建议补充 `.gitignore`（忽略 `node_modules/`、`.temp/`、`.cache/`、`dist/` 等）。

