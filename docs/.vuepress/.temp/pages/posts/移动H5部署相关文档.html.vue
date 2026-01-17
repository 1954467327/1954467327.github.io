<template><div><p>提示：H5 包已经集成在 kb 包中，只需要修改相关配置文件。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token punctuation">[</span>root@test static<span class="token punctuation">]</span><span class="token comment"># cat /etc/LeagView.conf</span></span>
<span class="line"><span class="token comment">#path=挂载目录</span></span>
<span class="line"><span class="token assign-left variable">path</span><span class="token operator">=</span>/opt/leagsoft </span>
<span class="line"><span class="token assign-left variable">product</span><span class="token operator">=</span>LeagView</span>
<span class="line"><span class="token assign-left variable">user</span><span class="token operator">=</span>leagsoft</span>
<span class="line"><span class="token assign-left variable">processctrl</span><span class="token operator">=</span>root</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="_1-配置前端h5配置文件" tabindex="-1"><a class="header-anchor" href="#_1-配置前端h5配置文件"><span>1.配置前端H5配置文件</span></a></h1>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">cp</span> <span class="token parameter variable">-p</span> 挂载目录/LeagView/nginx/html/approval/h5/static/config-dev.js 挂载目录/LeagView/nginx/html/approval/h5/static/config.js</span>
<span class="line"><span class="token function">vi</span> config.js</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><p>配置h5-pro，配置此参数可以在地址栏带上审批员，例如 ehr=审批员</p>
<!-- 这是一张图片，ocr 内容为： -->
<p><img src="https://cdn.nlark.com/yuque/0/2025/png/40933698/1744803181179-d28d1d5c-02a5-4506-bee6-5972368d0fa1.png" alt=""></p>
<h1 id="_2-修改nginx配置" tabindex="-1"><a class="header-anchor" href="#_2-修改nginx配置"><span>2.修改nginx配置</span></a></h1>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">vi</span> 挂载目录/LeagView/nginx/conf/server/30098_server.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>带上框线参数</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">  location /approval/h5 <span class="token punctuation">{</span></span>
<span class="line">    root ./html<span class="token punctuation">;</span></span>
<span class="line">    index index.html index.htm<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><!-- 这是一张图片，ocr 内容为： -->
<p><img src="https://cdn.nlark.com/yuque/0/2025/png/40933698/1744803368448-ea2a20f5-6d18-4b03-a210-d492468d9323.png" alt=""></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">挂载目录/LeagView/nginx/sbin/LeagViewNginx_docker restart</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><!-- 这是一张图片，ocr 内容为： -->
<p><img src="https://cdn.nlark.com/yuque/0/2025/png/40933698/1744803490878-66d58af8-af15-4295-9e19-a59a00052da4.png" alt=""></p>
<h1 id="_3-访问h5前端页面" tabindex="-1"><a class="header-anchor" href="#_3-访问h5前端页面"><span>3.访问H5前端页面</span></a></h1>
<p>需要结合场景判断是否需要开启密码登录：<font style="color:#DF2A3F;">InterfacePwdCheck=true</font></p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">vi</span> 挂载目录/LeagView/Ini/config.properties</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p><a href="http://10.19.19.23:30098/approval/h5/?ehr=cn#/pages/index/index" target="_blank" rel="noopener noreferrer">http://10.19.19.23:30098/approval/h5</a></p>
<p>带审批员：http://10.19.19.23:30098/approval/h5/?ehr=审批员账号</p>
<h1 id="_4-部署wms-开启h5预览功能" tabindex="-1"><a class="header-anchor" href="#_4-部署wms-开启h5预览功能"><span>4.部署WMS，开启H5预览功能</span></a></h1>
<h3 id="下载wms包" tabindex="-1"><a class="header-anchor" href="#下载wms包"><span>下载WMS包：</span></a></h3>
<p><a href="http://10.8.98.22:8888/develop/20250630SP.41/" target="_blank" rel="noopener noreferrer">http://10.8.98.22:8888/develop/20250630SP.41/</a></p>
<!-- 这是一张图片，ocr 内容为： -->
<p><img src="https://cdn.nlark.com/yuque/0/2025/png/40933698/1744876283259-37fdd25b-22cc-4242-b172-890745e58578.png" alt=""></p>
<p>安装命令示例：./install-20250630SP.41.exe -i 10.200.55.53 -l 10.200.55.53  -g 172.33.0.1/24</p>
<!-- 这是一张图片，ocr 内容为： -->
<p><img src="https://cdn.nlark.com/yuque/0/2025/png/40933698/1744871850259-30939109-5edd-4cd9-a79d-4dcdaffc278d.png" alt=""></p>
<p>安装成功显示内容：</p>
<!-- 这是一张图片，ocr 内容为： -->
<p><img src="https://cdn.nlark.com/yuque/0/2025/png/40933698/1744871863128-88a6bea9-85ce-45dd-9e4c-8f808de34fe3.png" alt=""></p>
<h3 id="配置前端预览配置-集成部署末尾追加" tabindex="-1"><a class="header-anchor" href="#配置前端预览配置-集成部署末尾追加"><span>配置前端预览配置（集成部署末尾追加）：</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">vi</span> 挂载目录/LeagView/Ini/config.properties</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><blockquote>
<p>#水印方案名称</p>
<p>newWmsWatermarkname=empty</p>
<p>#支持预览文件</p>
<p>newWmsSupportTypes=txt,doc,docx,xls,xlsx,ppt,pptx,pdf</p>
<p>#WMS服务码，可以假值</p>
<p>newWmsServiceCode=</p>
<p>#WMS接口地址</p>
<p>newWmsPath=http://127.0.0.1:9999/wms/</p>
<p>#关闭H5审批页面“下载”，默认false</p>
<p>#H5FileNotDownload=true</p>
<p>#是否需要隐藏文件预览 ，默认false</p>
<p>#H5FileNOTPreview=true</p>
</blockquote>
<h3 id="wms服务器设置白名单-独立部署-只用预览-可以配置白名单-新增xsource-dat加入ip-修改要重启docker-多个ip用分号隔开" tabindex="-1"><a class="header-anchor" href="#wms服务器设置白名单-独立部署-只用预览-可以配置白名单-新增xsource-dat加入ip-修改要重启docker-多个ip用分号隔开"><span>wms服务器设置白名单，独立部署:只用预览，可以配置白名单，新增xsource.dat加入ip，修改要重启docker，多个ip用分号隔开</span></a></h3>
<p>在服务器/hhh/hdata下面的三个目录新增文件xsource.dat，把需要访问的ip加入文件中，多个ip用分号隔开。</p>
<!-- 这是一张图片，ocr 内容为： -->
<p><img src="https://cdn.nlark.com/yuque/0/2025/png/40933698/1744876872981-e9d53552-8b1d-4df2-9aff-ba9150d6e324.png" alt=""></p>
</div></template>


