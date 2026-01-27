import{_ as n,c as a,a as e,o as l}from"./app-B6dMC2F3.js";const p={};function i(t,s){return l(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="linux互信" tabindex="-1"><a class="header-anchor" href="#linux互信"><span>Linux互信</span></a></h1><p>此文档介绍互信的原理，并提供批量互信脚本支持一键对多个服务器进行单向互信，服务器密码可以使用统一密码也可以使用自定义密码</p><h2 id="_1-互信原理" tabindex="-1"><a class="header-anchor" href="#_1-互信原理"><span>1. 互信原理</span></a></h2><h3 id="_1-1-ssh公钥认证机制" tabindex="-1"><a class="header-anchor" href="#_1-1-ssh公钥认证机制"><span>1.1 SSH公钥认证机制</span></a></h3><ul><li>Linux互信基于SSH协议的公钥认证机制，其核心原理是：</li><li>非对称加密：使用RSA或ED25519等算法生成公钥-私钥对</li><li>身份验证：客户端用私钥签名，服务端用公钥验证签名</li><li>免密登录：验证成功后无需输入密码即可建立SSH连接</li></ul><h3 id="_1-2-工作流程" tabindex="-1"><a class="header-anchor" href="#_1-2-工作流程"><span>1.2 工作流程</span></a></h3><ol><li>客户端发起SSH连接请求</li><li>服务端返回随机字符串(challenge)</li><li>客户端用私钥对字符串进行数字签名</li><li>服务端用存储的公钥验证签名</li><li>验证通过 → 建立连接；验证失败 → 要求密码认证</li></ol><h3 id="_1-3-互信类型" tabindex="-1"><a class="header-anchor" href="#_1-3-互信类型"><span>1.3 互信类型</span></a></h3><ul><li>单向互信：A信任B，但B不信任A（A→B）</li><li>双向互信：A信任B且B信任A（A↔B）</li><li>多机互信：集群中所有节点相互信任</li></ul><h2 id="_2-互信的步骤" tabindex="-1"><a class="header-anchor" href="#_2-互信的步骤"><span>2. 互信的步骤</span></a></h2><h3 id="_1-1-生成本地密钥" tabindex="-1"><a class="header-anchor" href="#_1-1-生成本地密钥"><span>1.1 生成本地密钥</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 参数说明：</span></span>
<span class="line"><span class="token comment"># -t: 密钥类型</span></span>
<span class="line"><span class="token comment"># -b: 密钥长度</span></span>
<span class="line"><span class="token comment"># -N: 空密码短语</span></span>
<span class="line"><span class="token comment"># -f: 指定密钥文件路径</span></span>
<span class="line">ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-b</span> <span class="token number">4096</span> <span class="token parameter variable">-N</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 生成的.ssh 目录权限</span></span>
<span class="line">drwx------  <span class="token number">2</span> root root       <span class="token number">4096</span> Jan <span class="token number">21</span> 09:34 .ssh</span>
<span class="line"><span class="token comment"># 生成的公私钥权限</span></span>
<span class="line">-rw------- <span class="token number">1</span> root root <span class="token number">3381</span> Jan <span class="token number">21</span> 09:34 id_rsa</span>
<span class="line">-rw-r--r-- <span class="token number">1</span> root root  <span class="token number">744</span> Jan <span class="token number">21</span> 09:34 id_rsa.pub</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-分发公钥到目标服务器" tabindex="-1"><a class="header-anchor" href="#_1-2-分发公钥到目标服务器"><span>1.2 分发公钥到目标服务器</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 使用默认密钥分发 首次连接需要输入密码，后续免密</span></span>
<span class="line">ssh-copy-id username@target_server_ip</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 实际执行</span></span>
<span class="line"><span class="token punctuation">[</span>root@LV7000-CE791A .ssh<span class="token punctuation">]</span><span class="token comment"># ssh-copy-id root@10.19.31.36</span></span>
<span class="line">/usr/bin/ssh-copy-id: INFO: Source of key<span class="token punctuation">(</span>s<span class="token punctuation">)</span> to be installed: <span class="token string">&quot;/root/.ssh/id_rsa.pub&quot;</span></span>
<span class="line">The authenticity of <span class="token function">host</span> <span class="token string">&#39;10.19.31.36 (10.19.31.36)&#39;</span> can<span class="token string">&#39;t be established.</span>
<span class="line">ED25519 key fingerprint is SHA256:RbHHoMjGkBlFZVhRMX6YgKdGAGztZmxbEhqg6qqQcyY.</span>
<span class="line">This key is not known by any other names.</span>
<span class="line">Are you sure you want to continue connecting (yes/no/[fingerprint])? yes</span>
<span class="line">/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed</span>
<span class="line">/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys</span>
<span class="line">#//////////////////////////////////////////////////////////////////////////////////////////////////##</span>
<span class="line"># Without the owner&#39;</span>s prior written consent,no decompiling or reverse-engineering shall be allowed.<span class="token comment">#</span></span>
<span class="line"><span class="token comment">#                                                                                                  #</span></span>
<span class="line">                                                                 <span class="token comment">#</span></span>
<span class="line"><span class="token comment">#//////////////////////////////////////////////////////////////////////////////////////////////////#</span></span>
<span class="line"></span>
<span class="line">root@10.19.31.36<span class="token string">&#39;s password: </span>
<span class="line"></span>
<span class="line">Number of key(s) added: 1</span>
<span class="line"></span>
<span class="line">Now try logging into the machine, with:   &quot;ssh &#39;</span>root@10.19.31.36&#39;&quot;</span>
<span class="line">and check to <span class="token function">make</span> sure that only the key<span class="token punctuation">(</span>s<span class="token punctuation">)</span> you wanted were added.</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 目标服务器.ssh目录权限</span></span>
<span class="line">drwx------  <span class="token number">2</span> root root       <span class="token number">4096</span> Jan <span class="token number">21</span> 09:39 .ssh</span>
<span class="line"><span class="token comment"># 分发后只会生成authorized_keys</span></span>
<span class="line"><span class="token punctuation">[</span>root@LV7000-8F1E5F .ssh<span class="token punctuation">]</span><span class="token comment"># ls -la</span></span>
<span class="line">total <span class="token number">12</span></span>
<span class="line">drwx------ <span class="token number">2</span> root root <span class="token number">4096</span> Jan <span class="token number">21</span> 09:39 <span class="token builtin class-name">.</span></span>
<span class="line">drw------- <span class="token number">7</span> root root <span class="token number">4096</span> Jan <span class="token number">21</span> 09:39 <span class="token punctuation">..</span></span>
<span class="line">-rw------- <span class="token number">1</span> root root  <span class="token number">744</span> Jan <span class="token number">21</span> 09:39 authorized_keys</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-互信失败检测" tabindex="-1"><a class="header-anchor" href="#_3-互信失败检测"><span>3. 互信失败检测</span></a></h2><ol><li>家目录 (~) :家目录本身不能对其他用户有写权限。</li><li>ssh目录 (~/.ssh) 必须是700</li><li>私钥文件 (~/.ssh/id_rsa, ~/.ssh/id_ed25519等)：必须是 600。</li><li>公钥文件 (~/.ssh/id_rsa.pub, ~/.ssh/id_ed25519.pub)：可以是 644或 600。644是标准且安全的。</li><li>授权密钥文件 (~/.ssh/authorized_keys)：必须是 600。</li></ol><h3 id="_3-1-客户端权限" tabindex="-1"><a class="header-anchor" href="#_3-1-客户端权限"><span>3.1 客户端权限</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 生成的.ssh 目录权限</span></span>
<span class="line">drwx------  <span class="token number">2</span> root root       <span class="token number">4096</span> Jan <span class="token number">21</span> 09:34 .ssh</span>
<span class="line"><span class="token comment"># 生成的公私钥权限</span></span>
<span class="line">-rw------- <span class="token number">1</span> root root <span class="token number">3381</span> Jan <span class="token number">21</span> 09:34 id_rsa</span>
<span class="line">-rw-r--r-- <span class="token number">1</span> root root  <span class="token number">744</span> Jan <span class="token number">21</span> 09:34 id_rsa.pub</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-服务端权限" tabindex="-1"><a class="header-anchor" href="#_3-2-服务端权限"><span>3.2 服务端权限</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 目标服务器.ssh目录权限</span></span>
<span class="line">drwx------  <span class="token number">2</span> root root       <span class="token number">4096</span> Jan <span class="token number">21</span> 09:39 .ssh</span>
<span class="line"><span class="token comment"># 分发后只会生成authorized_keys</span></span>
<span class="line"><span class="token punctuation">[</span>root@LV7000-8F1E5F .ssh<span class="token punctuation">]</span><span class="token comment"># ls -la</span></span>
<span class="line">-rw------- <span class="token number">1</span> root root  <span class="token number">744</span> Jan <span class="token number">21</span> 09:39 authorized_keys</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-批量互信脚本" tabindex="-1"><a class="header-anchor" href="#_4-批量互信脚本"><span>4. 批量互信脚本</span></a></h2><ul><li>PS：需要安装expect命令</li><li>生成本地密钥：判断当前服务器是否生产过密钥生成过则不在生成；</li><li>获取自定义密码：通过自定义密码和统一密码，优先使用自定义密码，否则从统一密码获取</li><li>分发：通过命令分发到其他服务器</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token builtin class-name">set</span> <span class="token parameter variable">-euo</span> pipefail</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 颜色定义</span></span>
<span class="line"><span class="token assign-left variable">RED</span><span class="token operator">=</span><span class="token string">&#39;\\033[0;31m&#39;</span></span>
<span class="line"><span class="token assign-left variable">GREEN</span><span class="token operator">=</span><span class="token string">&#39;\\033[0;32m&#39;</span></span>
<span class="line"><span class="token assign-left variable">NC</span><span class="token operator">=</span><span class="token string">&#39;\\033[0m&#39;</span> <span class="token comment"># No Color</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 配置部分</span></span>
<span class="line"><span class="token assign-left variable">HOSTS</span><span class="token operator">=</span><span class="token punctuation">(</span></span>
<span class="line"><span class="token string">&quot;10.19.31.166&quot;</span></span>
<span class="line"><span class="token comment">#&quot;82.204.80.20&quot;</span></span>
<span class="line"><span class="token comment"># 添加更多主机IP...</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 远程用户名</span></span>
<span class="line"><span class="token assign-left variable">remoteUser</span><span class="token operator">=</span><span class="token string">&quot;appuser&quot;</span></span>
<span class="line"><span class="token comment">#默认密码</span></span>
<span class="line"><span class="token assign-left variable">DEFAULT_PASSWORD</span><span class="token operator">=</span><span class="token string">&quot;2J02?{zSJ&quot;</span></span>
<span class="line"><span class="token comment">#自定义密码</span></span>
<span class="line"><span class="token builtin class-name">declare</span> <span class="token parameter variable">-A</span> <span class="token assign-left variable">HOST_PASSWORDS</span><span class="token operator">=</span><span class="token punctuation">(</span></span>
<span class="line">	<span class="token punctuation">[</span><span class="token string">&quot;10.19.17.140&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;XCtsat@2025aaa&quot;</span></span>
<span class="line">	<span class="token punctuation">[</span><span class="token string">&quot;10.19.17.26&quot;</span><span class="token punctuation">]</span><span class="token operator">=</span><span class="token string">&quot;Tiao@lv7aa000&quot;</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment"># 安全提示函数</span></span>
<span class="line"><span class="token function-name function">safe_prompt</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">prompt</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">var_name</span><span class="token operator">=</span><span class="token variable">$2</span></span>
<span class="line">    <span class="token builtin class-name">read</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-p</span> <span class="token string">&quot;<span class="token variable">$prompt</span>&quot;</span> <span class="token string">&quot;<span class="token variable">$var_name</span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">echo</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;密码已输入（脱敏显示）&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 1. 生成本地RSA密钥</span></span>
<span class="line"><span class="token function-name function">generate_local_key</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;<span class="token variable">\${GREEN}</span>[步骤1] 检查本地RSA密钥...<span class="token variable">\${NC}</span>&quot;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-f</span> ~/.ssh/id_rsa <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;正在生成本地RSA密钥...&quot;</span></span>
<span class="line">        ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-b</span> <span class="token number">4096</span> <span class="token parameter variable">-N</span> <span class="token string">&quot;&quot;</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;本地密钥已生成: ~/.ssh/id_rsa&quot;</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token string">&quot;本地密钥已存在，跳过生成&quot;</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 建立互信</span></span>
<span class="line"><span class="token function-name function">setup_trust</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">host</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>get_password <span class="token string">&quot;<span class="token variable">$host</span>&quot;</span><span class="token variable">)</span></span></span>
<span class="line">    </span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;<span class="token entity" title="\\n">\\n</span><span class="token variable">\${GREEN}</span>[步骤2] 与主机 <span class="token variable">$host</span> 建立互信...<span class="token variable">\${NC}</span>&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 上传本地公钥到远程</span></span>
<span class="line">    <span class="token function">expect</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOF</span>
<span class="line">    set timeout 30</span>
<span class="line">    spawn ssh-copy-id <span class="token variable">\${remoteUser}</span>@<span class="token variable">\${host}</span></span>
<span class="line">		expect {</span>
<span class="line">		&quot;yes/no&quot; { send &quot;yes<span class="token entity" title="\\r">\\r</span>&quot;; exp_continue }</span>
<span class="line">		&quot;password:&quot; { send &quot;<span class="token variable">$password</span><span class="token entity" title="\\r">\\r</span>&quot;; exp_continue }</span>
<span class="line">		&quot;Permission denied&quot; {</span>
<span class="line">				puts stderr &quot;错误: 主机<span class="token variable">$host</span> 密码错误!&quot;</span>
<span class="line">				exit 1</span>
<span class="line">			}</span>
<span class="line">		eof</span>
<span class="line">	}</span>
<span class="line">EOF</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 独立的转义函数</span></span>
<span class="line"><span class="token function-name function">escape_password</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$1</span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$password</span>&quot;</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token punctuation">\\</span></span>
<span class="line">        <span class="token parameter variable">-e</span> <span class="token string">&#39;s/\\\\/\\\\\\\\/g&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">        <span class="token parameter variable">-e</span> <span class="token string">&#39;s/\\&quot;/\\\\\\&quot;/g&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">        <span class="token parameter variable">-e</span> <span class="token string">&#39;s/\\$/\\\\$/g&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">        <span class="token parameter variable">-e</span> <span class="token string">&#39;s/{/\\\\{/g&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">        <span class="token parameter variable">-e</span> <span class="token string">&#39;s/}/\\\\}/g&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">        <span class="token parameter variable">-e</span> <span class="token string">&#39;s/\\[/\\\\\\[/g&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">        <span class="token parameter variable">-e</span> <span class="token string">&#39;s/\\]/\\\\\\]/g&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">        <span class="token parameter variable">-e</span> <span class="token string">&#39;s/\\//\\\\\\//g&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">        <span class="token parameter variable">-e</span> <span class="token string">&#39;s/\`/\\\\\`/g&#39;</span> <span class="token punctuation">\\</span></span>
<span class="line">        <span class="token parameter variable">-e</span> <span class="token string">&#39;s/!/\\\\!/g&#39;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取密码</span></span>
<span class="line"><span class="token function-name function">get_password</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin class-name">local</span> <span class="token assign-left variable">host</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line">	<span class="token comment"># 明确定义局部变量</span></span>
<span class="line">    <span class="token builtin class-name">local</span> password</span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 根据条件赋值</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token parameter variable">-n</span> <span class="token string">&quot;<span class="token variable">\${HOST_PASSWORDS<span class="token punctuation">[</span>$host<span class="token punctuation">]</span><span class="token operator">:-</span>}</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">        <span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${HOST_PASSWORDS<span class="token punctuation">[</span>$host<span class="token punctuation">]</span>}</span>&quot;</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        <span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">\${DEFAULT_PASSWORD}</span>&quot;</span></span>
<span class="line">    <span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 调用转义函数并捕获结果</span></span>
<span class="line">    <span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>escape_password <span class="token string">&quot;<span class="token variable">$password</span>&quot;</span><span class="token variable">)</span></span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 只返回一次最终值</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$password</span>&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 主流程</span></span>
<span class="line"><span class="token function-name function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment"># 生成本地密钥</span></span>
<span class="line">    generate_local_key</span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 批量处理远程主机</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token for-or-select variable">host</span> <span class="token keyword">in</span> <span class="token string">&quot;<span class="token variable">\${HOSTS<span class="token punctuation">[</span>@<span class="token punctuation">]</span>}</span>&quot;</span><span class="token punctuation">;</span> <span class="token keyword">do</span></span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;<span class="token entity" title="\\n">\\n</span><span class="token variable">\${GREEN}</span>&gt;&gt;&gt; 开始处理主机: <span class="token variable">\${host}</span> &lt;&lt;&lt; <span class="token variable">\${NC}</span>&quot;</span></span>
<span class="line">        <span class="token comment"># 建立互信</span></span>
<span class="line">        setup_trust <span class="token string">&quot;<span class="token variable">\${host}</span>&quot;</span></span>
<span class="line">        </span>
<span class="line">        <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;<span class="token variable">\${GREEN}</span>主机 <span class="token variable">\${host}</span> 配置完成!<span class="token variable">\${NC}</span>&quot;</span></span>
<span class="line">    <span class="token keyword">done</span></span>
<span class="line">    </span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">&quot;<span class="token entity" title="\\n">\\n</span><span class="token variable">\${GREEN}</span>所有主机配置完成!<span class="token variable">\${NC}</span>&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 执行主流程</span></span>
<span class="line">main</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,23)])])}const o=n(p,[["render",i]]),r=JSON.parse('{"path":"/posts/linux-mutual-trust.html","title":"Linux互信","lang":"zh-CN","frontmatter":{"lang":"zh-CN","title":"Linux互信","description":"此文档介绍互信的原理，并提供批量互信脚本支持一键对多个服务器进行单向互信，服务器密码可以使用统一密码也可以使用自定义密码","date":"2026-01-21T00:00:00.000Z","category":["Linux"],"tag":["互信"]},"headers":[{"level":2,"title":"1. 互信原理","slug":"_1-互信原理","link":"#_1-互信原理","children":[{"level":3,"title":"1.1 SSH公钥认证机制","slug":"_1-1-ssh公钥认证机制","link":"#_1-1-ssh公钥认证机制","children":[]},{"level":3,"title":"1.2 工作流程","slug":"_1-2-工作流程","link":"#_1-2-工作流程","children":[]},{"level":3,"title":"1.3 互信类型","slug":"_1-3-互信类型","link":"#_1-3-互信类型","children":[]}]},{"level":2,"title":"2. 互信的步骤","slug":"_2-互信的步骤","link":"#_2-互信的步骤","children":[{"level":3,"title":"1.1 生成本地密钥","slug":"_1-1-生成本地密钥","link":"#_1-1-生成本地密钥","children":[]},{"level":3,"title":"1.2 分发公钥到目标服务器","slug":"_1-2-分发公钥到目标服务器","link":"#_1-2-分发公钥到目标服务器","children":[]}]},{"level":2,"title":"3. 互信失败检测","slug":"_3-互信失败检测","link":"#_3-互信失败检测","children":[{"level":3,"title":"3.1 客户端权限","slug":"_3-1-客户端权限","link":"#_3-1-客户端权限","children":[]},{"level":3,"title":"3.2 服务端权限","slug":"_3-2-服务端权限","link":"#_3-2-服务端权限","children":[]}]},{"level":2,"title":"4. 批量互信脚本","slug":"_4-批量互信脚本","link":"#_4-批量互信脚本","children":[]}],"git":{"updatedTime":1769507802000,"contributors":[{"name":"litong","username":"litong","email":"litong@leagsoft.com","commits":1,"url":"https://github.com/litong"}],"changelog":[{"hash":"d1323c6a400299356d3323a6fc7e113ad46a67d1","time":1769507802000,"email":"litong@leagsoft.com","author":"litong","message":"新增：删除文档"}]},"filePathRelative":"posts/linux-mutual-trust.md","excerpt":"\\n<p>此文档介绍互信的原理，并提供批量互信脚本支持一键对多个服务器进行单向互信，服务器密码可以使用统一密码也可以使用自定义密码</p>\\n<h2>1. 互信原理</h2>\\n<h3>1.1 SSH公钥认证机制</h3>\\n<ul>\\n<li>Linux互信基于SSH协议的公钥认证机制，其核心原理是：</li>\\n<li>非对称加密：使用RSA或ED25519等算法生成公钥-私钥对</li>\\n<li>身份验证：客户端用私钥签名，服务端用公钥验证签名</li>\\n<li>免密登录：验证成功后无需输入密码即可建立SSH连接</li>\\n</ul>\\n<h3>1.2 工作流程</h3>\\n<ol>\\n<li>客户端发起SSH连接请求</li>\\n<li>服务端返回随机字符串(challenge)</li>\\n<li>客户端用私钥对字符串进行数字签名</li>\\n<li>服务端用存储的公钥验证签名</li>\\n<li>验证通过 → 建立连接；验证失败 → 要求密码认证</li>\\n</ol>"}');export{o as comp,r as data};
