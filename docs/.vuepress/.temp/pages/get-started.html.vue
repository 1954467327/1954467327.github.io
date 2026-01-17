<template><div><h1 id="启动" tabindex="-1"><a class="header-anchor" href="#启动"><span>启动</span></a></h1>
<p>这是一个普通的页面，其中包含了 VuePress 的基本内容。</p>
<h2 id="页数" tabindex="-1"><a class="header-anchor" href="#页数"><span>页数</span></a></h2>
<p>您可以在您的 vuepress 目录中添加 markdown 文件，每一个 markdown 文件都会被转换为您网站上的一个页面。
请参阅 [路由][] 以获取更多详细信息。</p>
<h2 id="内容" tabindex="-1"><a class="header-anchor" href="#内容"><span>内容</span></a></h2>
<p>每个 Markdown 文件都会被转换为 HTML 格式，然后再转换为 Vue 的 SFC 文件格式（即“内容”部分）。
VuePress 支持基本的 Markdown 语法以及一些扩展（如 [synatex-extensions]），您还可以在其中使用 Vue 的特性（如 [vue-feature]）。</p>
<h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h2>
<p>VuePress 会使用一个名为 <code v-pre>.vuepress/config.js</code>（或 <code v-pre>.ts</code>）的文件作为[站点配置][config]，您可以利用它来配置您的站点。
对于[客户端配置][客户端配置]，您可以创建 <code v-pre>.vuepress/client.js</code>（或者 <code v-pre>.ts</code>）文件。
同时，您还可以通过 [frontmatter][] 来为每个页面添加配置。</p>
<h2 id="布局与自定义设置" tabindex="-1"><a class="header-anchor" href="#布局与自定义设置"><span>布局与自定义设置</span></a></h2>
<p>以下是 <code v-pre>@vuepress/theme-default</code> 的常见配置控制布局：</p>
<ul>
<li>[导航栏][]</li>
<li>[侧边栏][]
请查阅[默认主题文档][默认主题]以获取完整说明。
您可以通过编辑 <code v-pre>.vuepress/styles/index.scss</code> 文件来添加额外的样式。
[路由]：https://vuejs.press/guide/page.html#routing
[内容]：https://vuejs.press/guide/page.html#content
[语法扩展]：https://vuejs.press/guide/markdown.html#syntax-extensions
[Vue 特性]：https://vuejs.press/guide/markdown.html#使用 Vue 进行 Markdown 编写
[配置]：https://vuejs.press/guide/configuration.html#客户端配置文件
[客户端配置]：https://vuejs.press/guide/configuration.html#客户端配置文件
[前置内容]：https://vuejs.press/guide/page.html#frontmatter
[导航栏]：https://vuejs.press/reference/default-theme/config.html#navbar
[侧边栏]：https://vuejs.press/reference/default-theme/config.html#sidebar
[默认主题]：https://vuejs.press/reference/default-theme/
[样式]：https://vuejs.press/reference/default-theme/styles.html#样式文件</li>
</ul>
</div></template>


