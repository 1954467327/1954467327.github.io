import comp from "/Users/litong/vuepress/vuepress-starter/docs/.vuepress/.temp/pages/posts/移动H5部署相关文档.html.vue"
const data = JSON.parse("{\"path\":\"/posts/%E7%A7%BB%E5%8A%A8H5%E9%83%A8%E7%BD%B2%E7%9B%B8%E5%85%B3%E6%96%87%E6%A1%A3.html\",\"title\":\"1.配置前端H5配置文件\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"headers\":[{\"level\":3,\"title\":\"下载WMS包：\",\"slug\":\"下载wms包\",\"link\":\"#下载wms包\",\"children\":[]},{\"level\":3,\"title\":\"配置前端预览配置（集成部署末尾追加）：\",\"slug\":\"配置前端预览配置-集成部署末尾追加\",\"link\":\"#配置前端预览配置-集成部署末尾追加\",\"children\":[]},{\"level\":3,\"title\":\"wms服务器设置白名单，独立部署:只用预览，可以配置白名单，新增xsource.dat加入ip，修改要重启docker，多个ip用分号隔开\",\"slug\":\"wms服务器设置白名单-独立部署-只用预览-可以配置白名单-新增xsource-dat加入ip-修改要重启docker-多个ip用分号隔开\",\"link\":\"#wms服务器设置白名单-独立部署-只用预览-可以配置白名单-新增xsource-dat加入ip-修改要重启docker-多个ip用分号隔开\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"posts/移动H5部署相关文档.md\",\"excerpt\":\"<p>提示：H5 包已经集成在 kb 包中，只需要修改相关配置文件。</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-highlighter=\\\"prismjs\\\" data-ext=\\\"sh\\\"><pre><code><span class=\\\"line\\\"><span class=\\\"token punctuation\\\">[</span>root@test static<span class=\\\"token punctuation\\\">]</span><span class=\\\"token comment\\\"># cat /etc/LeagView.conf</span></span>\\n<span class=\\\"line\\\"><span class=\\\"token comment\\\">#path=挂载目录</span></span>\\n<span class=\\\"line\\\"><span class=\\\"token assign-left variable\\\">path</span><span class=\\\"token operator\\\">=</span>/opt/leagsoft </span>\\n<span class=\\\"line\\\"><span class=\\\"token assign-left variable\\\">product</span><span class=\\\"token operator\\\">=</span>LeagView</span>\\n<span class=\\\"line\\\"><span class=\\\"token assign-left variable\\\">user</span><span class=\\\"token operator\\\">=</span>leagsoft</span>\\n<span class=\\\"line\\\"><span class=\\\"token assign-left variable\\\">processctrl</span><span class=\\\"token operator\\\">=</span>root</span>\\n<span class=\\\"line\\\"></span></code></pre>\\n<div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\" style=\\\"counter-reset:line-number 0\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
