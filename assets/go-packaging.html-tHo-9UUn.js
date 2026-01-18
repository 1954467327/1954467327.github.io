import{_ as s,c as a,a as i,o as e}from"./app-B29H8hna.js";const l={};function p(c,n){return e(),a("div",null,[...n[0]||(n[0]=[i(`<h1 id="go语言的封装" tabindex="-1"><a class="header-anchor" href="#go语言的封装"><span>Go语言的封装</span></a></h1><p>封装(encapsulation)就是把抽象出的字段和对字段的操作封装在⼀起，数据被保护在内部,程序的其它包只有通过被授权的操作⽅法，才能对字段进⾏操作。 封装的好处：1.隐藏实现细节 2.提可以对数据进⾏验证，保证安全合理</p><h2 id="go语言如何实现封装" tabindex="-1"><a class="header-anchor" href="#go语言如何实现封装"><span>Go语言如何实现封装</span></a></h2><ol><li>结构体和字段（属性）的首字母小写（小写代表其他包不可使用，本包的其他函数还是可以使用，封装没那么严格，类似于Java的private）</li><li>给结构体所在包提供⼀个⼯⼚模式的函数，⾸字⺟⼤写（类似⼀个构造函数）</li><li>提供一个首字母大写的Set方法（类似于Java的public），用于设置属性的值</li><li>提供⼀个⾸字⺟⼤写的Get⽅法(类似其它语⾔的public)，⽤于获取属性的值</li></ol><h2 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现"><span>代码实现</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">// person.go - 定义包</span>
<span class="line">package model</span>
<span class="line"></span>
<span class="line">import &quot;fmt&quot;</span>
<span class="line"></span>
<span class="line">// 1. 结构体和字段首字母小写（包内私有）</span>
<span class="line">type person struct {</span>
<span class="line">	name string</span>
<span class="line">	age  int</span>
<span class="line">	city string</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 2. 工厂模式构造函数（首字母大写）</span>
<span class="line">func NewPerson(name string, age int, city string) (*person, error) {</span>
<span class="line">	if age &lt; 0 || age &gt; 150 {</span>
<span class="line">		return nil, fmt.Errorf(&quot;年龄不合法: %d&quot;, age)</span>
<span class="line">	}</span>
<span class="line">	return &amp;person{</span>
<span class="line">		name: name,</span>
<span class="line">		age:  age,</span>
<span class="line">		city: city,</span>
<span class="line">	}, nil</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 3. Get方法（首字母大写）</span>
<span class="line">func (p *person) GetName() string {</span>
<span class="line">	return p.name</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">func (p *person) GetAge() int {</span>
<span class="line">	return p.age</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">func (p *person) GetCity() string {</span>
<span class="line">	return p.city</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 4. Set方法（首字母大写）</span>
<span class="line">func (p *person) SetName(name string) {</span>
<span class="line">	p.name = name</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">func (p *person) SetAge(age int) error {</span>
<span class="line">	if age &lt; 0 || age &gt; 150 {</span>
<span class="line">		return fmt.Errorf(&quot;年龄不合法: %d&quot;, age)</span>
<span class="line">	}</span>
<span class="line">	p.age = age</span>
<span class="line">	return nil</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">func (p *person) SetCity(city string) {</span>
<span class="line">	p.city = city</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">// 5. 其他业务方法</span>
<span class="line">func (p *person) String() string {</span>
<span class="line">	return fmt.Sprintf(&quot;Person{name=%s, age=%d, city=%s}&quot;, p.name, p.age, p.city)</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">// main.go - 使用示例</span>
<span class="line">package main</span>
<span class="line"></span>
<span class="line">import (</span>
<span class="line">	&quot;fmt&quot;</span>
<span class="line">	&quot;demo/model&quot; // 假设model包在demo/model目录下</span>
<span class="line">)</span>
<span class="line"></span>
<span class="line">func main() {</span>
<span class="line">	// 使用工厂函数创建person对象</span>
<span class="line">	p, err := model.NewPerson(&quot;张三&quot;, 25, &quot;北京&quot;)</span>
<span class="line">	if err != nil {</span>
<span class="line">		fmt.Println(&quot;创建失败:&quot;, err)</span>
<span class="line">		return</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	fmt.Println(&quot;初始状态:&quot;, p.String())</span>
<span class="line">	// 输出: 初始状态: Person{name=张三, age=25, city=北京}</span>
<span class="line"></span>
<span class="line">	// 使用Get方法获取属性</span>
<span class="line">	fmt.Printf(&quot;姓名: %s, 年龄: %d\\n&quot;, p.GetName(), p.GetAge())</span>
<span class="line">	// 输出: 姓名: 张三, 年龄: 25</span>
<span class="line"></span>
<span class="line">	// 使用Set方法修改属性</span>
<span class="line">	p.SetName(&quot;李四&quot;)</span>
<span class="line">	p.SetCity(&quot;上海&quot;)</span>
<span class="line">	if err := p.SetAge(30); err != nil {</span>
<span class="line">		fmt.Println(&quot;设置年龄失败:&quot;, err)</span>
<span class="line">	}</span>
<span class="line"></span>
<span class="line">	fmt.Println(&quot;修改后:&quot;, p.String())</span>
<span class="line">	// 输出: 修改后: Person{name=李四, age=30, city=上海}</span>
<span class="line"></span>
<span class="line">	// 尝试设置非法年龄</span>
<span class="line">	if err := p.SetAge(200); err != nil {</span>
<span class="line">		fmt.Println(&quot;错误:&quot;, err)</span>
<span class="line">		// 输出: 错误: 年龄不合法: 200</span>
<span class="line">	}</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7)])])}const d=s(l,[["render",p]]),r=JSON.parse('{"path":"/posts/go-packaging.html","title":"Go语言的封装","lang":"zh-CN","frontmatter":{"lang":"zh-CN","title":"Go语言的封装","description":"Go语言也支持面向对象，但不想Java一样严格遵循面向对象","date":"2026-01-16T00:00:00.000Z","category":["Goland"],"tag":["后端"]},"headers":[{"level":2,"title":"Go语言如何实现封装","slug":"go语言如何实现封装","link":"#go语言如何实现封装","children":[]},{"level":2,"title":"代码实现","slug":"代码实现","link":"#代码实现","children":[]}],"git":{"updatedTime":1768745737000,"contributors":[{"name":"litong","username":"litong","email":"1954467327@qq.com","commits":1,"url":"https://github.com/litong"}],"changelog":[{"hash":"f3619b9e08dcdfb416d0a535caf28329c6d97f7b","time":1768745737000,"email":"1954467327@qq.com","author":"litong","message":"新增：新增文章go语言的封装"}]},"filePathRelative":"posts/go-packaging.md","excerpt":"\\n<p>封装(encapsulation)就是把抽象出的字段和对字段的操作封装在⼀起，数据被保护在内部,程序的其它包只有通过被授权的操作⽅法，才能对字段进⾏操作。\\n封装的好处：1.隐藏实现细节   2.提可以对数据进⾏验证，保证安全合理</p>\\n<h2>Go语言如何实现封装</h2>\\n<ol>\\n<li>结构体和字段（属性）的首字母小写（小写代表其他包不可使用，本包的其他函数还是可以使用，封装没那么严格，类似于Java的private）</li>\\n<li>给结构体所在包提供⼀个⼯⼚模式的函数，⾸字⺟⼤写（类似⼀个构造函数）</li>\\n<li>提供一个首字母大写的Set方法（类似于Java的public），用于设置属性的值</li>\\n<li>提供⼀个⾸字⺟⼤写的Get⽅法(类似其它语⾔的public)，⽤于获取属性的值</li>\\n</ol>"}');export{d as comp,r as data};
