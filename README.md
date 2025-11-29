# 🚀 Edge Image Gen

一个部署在 Cloudflare 全球边缘网络上的 **AI 文本到图像（Text-to-Image）生成器**。只需输入一句话，即可在几秒钟内获得由 Stable Diffusion 模型生成的精美图片。

### 🤯 现场演示

![Live Demo](https://github.com/leouoq/pixel-edge/blob/main/pixeledge.png)

---

## ✨ 核心亮点

-   **边缘 AI 生成**: 直接在离用户最近的 Cloudflare 边缘节点运行 Stable Diffusion 模型，极大降低延迟。
-   **零成本运行**: 完全利用 Cloudflare Workers 和 Workers AI 的免费额度，是绝佳的个人项目和技术展示。
-   **即时响应 (Streaming)**: 利用流式响应（Streaming Response），图片在生成过程中就会被传输，用户无需等待漫长的处理过程，体验丝滑。
-   **极简代码**: 基于轻量级的 [Hono](https://hono.dev/) 框架，用不到 50 行代码就实现了全部核心功能。
-   **紧跟潮流**: 拥抱最新的 Generative AI 和 Serverless Edge 技术。

## 🛠️ 技术栈

-   **AI 模型**: [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) (内置 `@cf/stabilityai/stable-diffusion-xl-base-1.0` 模型)
-   **运行时**: [Cloudflare Workers](https://workers.cloudflare.com/)
-   **Web 框架**: [Hono](https://hono.dev/)
-   **语言**: [TypeScript](https://www.typescriptlang.org/)
-   **CI/CD**: [GitHub Actions](https://github.com/features/actions)

## ⚙️ 如何开始

### 1. 环境准备

-   安装 [Node.js](https://nodejs.org/) (v20 或更高版本)
-   一个 [Cloudflare](https://dash.cloudflare.com/) 账户

### 2. 本地安装

```bash
# 1. 克隆仓库
git clone https://github.com/leouoq/pixel-edge.git

# 2. 进入项目目录
cd pixel-edge

# 3. 安装依赖
npm install
```

### 3. 配置

#### a. `wrangler.toml` (关键)

这是项目的核心配置文件。**确保你已经启用了 AI 绑定**。

```toml
name = "pixel-edge"
main = "src/index.ts"
compatibility_date = "2024-04-01"

[ai]
binding = "AI"
```

#### b. GitHub Secrets (用于自动部署)

为了让 GitHub Actions 能够自动部署，请在你的 GitHub 仓库中设置以下 Secrets:
(`Settings` -> `Secrets and variables` -> `Actions`)

-   `CLOUDFLARE_API_TOKEN`: 你的 Cloudflare API 令牌。你可以在 [这里](https://dash.cloudflare.com/profile/api-tokens) 创建一个，使用 `Edit Cloudflare Workers` 模板。
-   `CLOUDFLARE_ACCOUNT_ID`: 你的 Cloudflare 账户 ID。你可以在 URL 看到 https://dash.cloudflare.com/你的 Cloudflare 账户 ID/home/domains

### 4. 本地开发

运行以下命令以启动本地开发服务器。**注意：本地环境无法真正调用 GPU 运行 AI 模型，此步骤主要用于测试路由是否正常。**

```bash
npm run dev
```

## 🚀 使用方法

部署成功后，你的 Worker 会提供一个简单的 GET 接口。

### 直接在浏览器或 `<img>` 标签中使用

将你的 Worker URL 和 `prompt` 参数组合起来，即可获得图片。

```html
<!-- 示例: 生成一只赛博朋克猫 -->
<img src="https://pixel-edge.your-worker-subdomain.workers.dev/?prompt=a%20cyberpunk%20cat%20in%20a%20neon-lit%20city" alt="AI Generated Image">
```

### 使用 `curl` 测试

你也可以用 `curl` 命令将生成的图片保存到本地。

```bash
curl -o cat.png "https://pixel-edge.your-worker-subdomain.workers.dev/?prompt=a%20cat%20wearing%20a%20tiny%20wizard%20hat"
```

> **提示**: `prompt` 参数的内容需要进行 URL 编码，例如将空格替换为 `%20`。

## 📄 许可证

本项目采用 [MIT License](./LICENSE)。
