---
lang: zh-CN
title: Go语言的多态
description: Go语言也支持面向对象，但不想Java一样严格遵循面向对象
date: 2026-01-18
category:
  - Goland
tag:
  - 后端
---
# Go语言的多态

变量(实例)具有多种形态。⾯向对象的第三⼤特征，在Go语⾔，多态特征是通过接⼝实现的。可以按照统⼀的接⼝来调⽤不同的实现。这时接⼝变量就呈现不同的形态。

## 接口定义

定义规则、定义规范，定义某种能⼒

### 接口说明

1. 接口定义本身不能包含成员变量/字段，只能包含方法签名。但这不意味着方法签名中不能有参数。

```go
// ✅ 正确的接口定义
type Writer interface {
	// 方法可以有参数（data）和返回值（n, err）
	Write(data []byte) (n int, err error)
}

// ❌ 错误的接口定义（编译不通过）
type BadInterface interface {
	buffer []byte        // 错误！接口不能包含字段
	counter int          // 错误！接口不能包含字段
}

```

2. 一个类型只要“实现了接口的所有方法”，就自动实现该接口（无需 implements 关键字）
   ```go
   	// 3) 只要实现了接口中的“所有方法”，就自动实现该接口（无需 implements）
   	var a private.PersonLike = p
   	var b private.PersonLike = s

   	showPersonLike(a)
   	showPersonLike(b)
   ```
3. Golang中的接⼝不需要显式的实现接⼝。Golang中没有implement关键字。Golang中实现接⼝是基于⽅法的，不是基于接⼝的
4. 接⼝⽬的是为了定义规范，具体由别⼈来实现即可。

```go

package private

// PersonLike 用来演示 Go 的接口规范：
// - 接口只包含方法签名，不包含字段
// - 一个类型只要“实现了接口的所有方法”，就自动实现该接口（无需 implements 关键字）
type PersonLike interface {
	GetName() string
	GetAge() int
	GetCity() string

	SetName(name string)
	SetAge(age int) error
	SetCity(city string)

	String() string
}

```

## Go语言如何实现多态

不同实现类通过实现接口，按照统一接口达到不同形态

## 代码实现

```go
func interface_demo() {
	// 1) person 虽然是 private 包内的未导出类型，但依然可以作为接口使用
	p, err := private.NewPerson("接口-张三", 20, "成都")
	if err != nil {
		fmt.Println("创建person失败:", err)
		return
	}

	// 2) Student 通过嵌入 person + 自己补充方法，也满足接口
	s, err := private.NewStudent("接口-王五", 18, "广州", "第一中学", 12)
	if err != nil {
		fmt.Println("创建student失败:", err)
		return
	}

	// 3) 只要实现了接口中的“所有方法”，就自动实现该接口（无需 implements）
	var a private.PersonLike = p
	var b private.PersonLike = s

	showPersonLike(a)
	showPersonLike(b)

	// 4) 可以放进同一个切片，体现“面向接口编程”
	list := []private.PersonLike{a, b}
	for _, v := range list {
		fmt.Println("列表元素:", v.String())
	}
}

func showPersonLike(x private.PersonLike) {
	fmt.Printf("接口视角: name=%s age=%d city=%s\n", x.GetName(), x.GetAge(), x.GetCity())
}

```

## 断言

可以直接判断是否是该类型的变量：

1. value, ok := element.(T)，这⾥value就是变量的值，ok是⼀个
   bool类型，element是interface变量，T是断⾔的类型。
2. Type Switch 的基本用法
   Type Switch 是 Go 语⾔中⼀种特殊的 switch 语句，它⽐较的是类型⽽不是具体的值。它判断某个接⼝变量的类型，然后根据具体类型再做相应处理。

### 断言代码实现

```go
func assertion_demo() {
	// 准备两个接口变量：一个底层是 person，一个底层是 Student
	p, _ := private.NewPerson("断言-person", 22, "西安")
	s, _ := private.NewStudent("断言-student", 16, "杭州", "实验中学", 10)

	var x private.PersonLike = p
	var y private.PersonLike = s

	// 1) 断言成具体类型：*private.Student
	// 对 x 断言会失败（因为底层不是 Student）
	if st, ok := x.(*private.Student); ok {
		fmt.Println("x 是 Student:", st.String())
	} else {
		fmt.Println("x 不是 *private.Student（断言失败）")
	}
	// 对 y 断言会成功
	if st, ok := y.(*private.Student); ok {
		fmt.Println("y 是 Student:", st.String())
	}

	// 2) 断言成“更小的能力接口”：private.Grader
	// Student 有 GetGrade/SetGrade，所以 ok；person 没有，所以不 ok
	if g, ok := x.(private.Grader); ok {
		fmt.Println("x 支持 Grader, grade:", g.GetGrade())
	} else {
		fmt.Println("x 不支持 Grader（person 没有年级能力）")
	}
	if g, ok := y.(private.Grader); ok {
		_ = g.SetGrade(9)
		fmt.Println("y 支持 Grader, 修改后 grade:", g.GetGrade())
	}

	// 3) type switch：根据接口变量的“底层具体类型”分支处理
	for _, v := range []private.PersonLike{x, y} {
		switch t := v.(type) {
		case *private.Student:
			fmt.Println("type switch: Student ->", t.GetSchool(), t.GetGrade())
		default:
			// 这里拿不到 *private.person（未导出），但依然能走 default 分支
			fmt.Println("type switch: 其他类型 ->", v.String())
		}
	}
}
```
