# Henry Ge

这是 Henry Ge 的个人博客。

目前是一名全栈开发工程师，早期从事 Java 后端开发，后来转向前端，也参与过开源项目和独立项目的开发。这个博客主要用来整理技术笔记、分享开发经验，也记录读书、游戏、旅行、球鞋和日常生活中的想法。

## 内容方向

- JavaScript、TypeScript、Rust 等技术笔记
- AI Coding 与软件开发工作流
- 项目实践和工程经验
- 读书、游戏、旅行和生活记录
- 关于技术、工作与个人成长的思考

## 站点

- [博客首页](https://henryge.com)
- [文章归档](https://henryge.com/posts)
- [项目展示](https://henryge.com/projects)
- [GitHub](https://github.com/gezhiheng)
- [X](https://x.com/h3nryge)

## 页面

- 首页：个人介绍和最近文章
- Posts：全部博客文章
- Projects：个人项目和开源项目
- Resume：个人简历

## 技术栈

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Markdown

文章内容保存在 `content/` 目录中，由 `src/lib/posts.ts` 解析并在构建时渲染。

## 本地开发

项目需要 Node.js 20+ 和 pnpm 10.33.2。

```bash
pnpm install
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看博客。

## 常用命令

```bash
pnpm dev      # 启动开发服务器
pnpm lint     # 运行 ESLint
pnpm build    # 构建生产版本
pnpm start    # 启动生产服务
pnpm deploy   # 本地构建并上传部署
```

## 项目结构

- `src/app/`：Next.js routes、layouts 和 route handlers
- `src/components/`：站点布局和共享 UI components
- `src/lib/`：文章解析、格式化和站点配置
- `content/`：Markdown 文章内容
- `public/`：图片、字体、favicon 等静态资源
- `scripts/`：构建和部署辅助脚本

## 部署

生产环境以 Docker 方式运行在 3000 端口，可通过 Nginx reverse proxy 到 `henryge.com`。

CI/CD 由 GitHub Actions 负责：

- PR 或手动触发时运行 `pnpm lint` 和 `pnpm build`
- `main` 分支更新或手动触发时构建 Docker image 并推送到 GHCR
- 如果配置了部署 secrets，会通过 SSH 拉取当前 commit 对应的 image 并重启容器

需要的部署 secrets：

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PORT`，可选
- `GHCR_USERNAME`
- `GHCR_TOKEN`

也可以使用本地构建上传流程：

```bash
pnpm deploy
```

`scripts/deploy-local.sh` 默认上传现有本地 build output。使用 `BUILD_SOURCE=clean ./scripts/deploy-local.sh` 可以保留旧的 clean `HEAD` 构建流程。
