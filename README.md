🧩 项目基本情况
	•	这是一个前端项目（React + TypeScript + Vite）
	•	没有后端服务代码（纯前端界面）
	•	部署本地就是 运行前端开发服务，也可以打包成静态文件部署到服务器或静态主机
	•	项目依赖管理由 npm/pnpm/yarn 控制
	•	package.json 显示了前端依赖和脚本命令  ￼

⸻

📦 一、前置准备

在本地运行之前，你需要：
	1.	💻 安装 Node.js（建议 v18+ 或更高版本）
官网：https://nodejs.org/
	2.	🧰 确认有 npm 或 yarn 或 pnpm 包管理器
安装 Node.js 会默认带 npm

⸻

🚀 二、在本地运行项目

在命令行中执行以下步骤：

1️⃣ 克隆项目到本地

git clone https://github.com/mainhalf/TCsat.git
cd TCsat

（如果用 SSH：git@github.com:mainhalf/TCsat.git）

⸻

2️⃣ 安装依赖

npm install

或者如果你用 yarn：

yarn install

或者 pnpm：

pnpm install

这一步会根据 package.json 下载所有项目依赖  ￼

⸻

3️⃣ 运行开发服务器

npm run dev

或者：

yarn dev

或者：

pnpm dev

执行后会输出一个本地开发地址，比如：

Local: http://localhost:5173

浏览器打开该地址就可以看到项目界面。

开发模式会监听文件改动并自动刷新页面。

⸻

🛠 三、本地打包成静态文件

当确认无误后，你也可以打包：

npm run build

或者：

npm run preview

	•	build 会生成静态资源（放在 dist/ 或类似文件夹）
	•	preview 会本地预览打包后的效果

这样就可以部署到任何静态服务器（如 Nginx、Apache 或 Netlify/Vercel 等）

⸻

📌 注意事项

✔️ 项目是前端界面，不包含数据库或真实后台 API
✔️ 如果项目需要与后台服务通信，可能还需要启动对应的后端服务器
✔️ 如果你想部署上线，可以用静态托管平台，比如 GitHub Pages / Vercel / Netlify / Cloudflare Pages

⸻

❔ 常见问题排查

❗ 安装依赖失败怎么办？
	•	清空依赖再装：

rm -rf node_modules package-lock.json
npm install

（Linux/macOS 用 rm -rf，Windows 用文件资源管理器删除）

⸻

❗ 端口占用或访问不到 localhost？

试换一个端口：

PORT=3000 npm run dev

（Windows PowerShell 用 $env:PORT=3000）

⸻
