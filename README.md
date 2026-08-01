# mcloud-docs

`mcloud-sign` 的 Astro + Starlight 文档站，包含使用指南、配置参考、功能说明、技术文档和浏览器端配置生成器。

## 技术栈

- Astro 6
- Starlight
- Monaco Editor
- Sharp

## 开发

```bash
npm install
npm run dev
```

本地默认地址为 `http://localhost:4321`。

## 构建与预览

```bash
npm run build
npm run preview
```

静态产物生成到 `dist/`。

## 目录

```text
src/content/docs/          # Markdown / MDX 文档
src/pages/                 # 配置生成器和密码页
src/components/starlight/  # Starlight 组件覆盖
public/config-generator.js # 配置生成器逻辑
public/config.schema.json  # Monaco 使用的配置 schema
```

## 同步原则

正式文档事实以 `mcloud-sign` Git `HEAD` 的已提交源码为准，而不是本地未提交工作区。核对时重点查看：

- `packages/shared/src/config/schema.ts`
- `packages/shared/generated/defaults.ts`
- `packages/shared/generated/config.schema.json`
- `packages/cli/src/index.ts`
- 根 `package.json` 与 `tsup.config.ts`
- `TASKS.md`

配置生成器的 schema 和默认值发生变化时，应从主项目 Git `HEAD` 读取对应生成产物并同步，避免把未提交字段提前发布。当前 `public/config.schema.json` 是主项目已提交生成 schema 的同步副本，供 Monaco 诊断使用。

## 访问门禁

当前 `/password` 页面只通过客户端脚本和 `sessionStorage` 提供简单访问提示，不属于安全认证。若文档需要保护敏感内容，应在部署平台、反向代理或身份访问层实现真正的认证。
