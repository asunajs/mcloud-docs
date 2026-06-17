import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async ({ url, redirect }, next) => {
  // 密码页面本身不需要验证
  if (url.pathname === '/password' || url.pathname === '/password/') {
    return next();
  }
  
  // 静态资源不需要验证
  if (url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/assets/')) {
    return next();
  }
  
  // 其他页面需要检查 cookie
  // 注意：由于 Astro 是静态站点，中间件在构建时运行
  // 我们需要在客户端进行验证
  return next();
};
