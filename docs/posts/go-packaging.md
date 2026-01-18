---
lang: zh-CN
title: Go语言的封装
description: Go语言也支持面向对象，但不想Java一样严格遵循面向对象
date: 2026-01-16
category:
  - Goland
tag:
  - 后端
---
# Go语言的封装

封装(encapsulation)就是把抽象出的字段和对字段的操作封装在⼀起，数据被保护在内部,程序的其它包只有通过被授权的操作⽅法，才能对字段进⾏操作。
封装的好处：1.隐藏实现细节   2.提可以对数据进⾏验证，保证安全合理

## Go语言如何实现封装

1. 结构体和字段（属性）的首字母小写（小写代表其他包不可使用，本包的其他函数还是可以使用，封装没那么严格，类似于Java的private）
2. 给结构体所在包提供⼀个⼯⼚模式的函数，⾸字⺟⼤写（类似⼀个构造函数）
3. 提供一个首字母大写的Set方法（类似于Java的public），用于设置属性的值
4. 提供⼀个⾸字⺟⼤写的Get⽅法(类似其它语⾔的public)，⽤于获取属性的值

## 代码实现

```
// person.go - 定义包
package model

import "fmt"

// 1. 结构体和字段首字母小写（包内私有）
type person struct {
	name string
	age  int
	city string
}

// 2. 工厂模式构造函数（首字母大写）
func NewPerson(name string, age int, city string) (*person, error) {
	if age < 0 || age > 150 {
		return nil, fmt.Errorf("年龄不合法: %d", age)
	}
	return &person{
		name: name,
		age:  age,
		city: city,
	}, nil
}

// 3. Get方法（首字母大写）
func (p *person) GetName() string {
	return p.name
}

func (p *person) GetAge() int {
	return p.age
}

func (p *person) GetCity() string {
	return p.city
}

// 4. Set方法（首字母大写）
func (p *person) SetName(name string) {
	p.name = name
}

func (p *person) SetAge(age int) error {
	if age < 0 || age > 150 {
		return fmt.Errorf("年龄不合法: %d", age)
	}
	p.age = age
	return nil
}

func (p *person) SetCity(city string) {
	p.city = city
}

// 5. 其他业务方法
func (p *person) String() string {
	return fmt.Sprintf("Person{name=%s, age=%d, city=%s}", p.name, p.age, p.city)
}

```

```
// main.go - 使用示例
package main

import (
	"fmt"
	"demo/model" // 假设model包在demo/model目录下
)

func main() {
	// 使用工厂函数创建person对象
	p, err := model.NewPerson("张三", 25, "北京")
	if err != nil {
		fmt.Println("创建失败:", err)
		return
	}

	fmt.Println("初始状态:", p.String())
	// 输出: 初始状态: Person{name=张三, age=25, city=北京}

	// 使用Get方法获取属性
	fmt.Printf("姓名: %s, 年龄: %d\n", p.GetName(), p.GetAge())
	// 输出: 姓名: 张三, 年龄: 25

	// 使用Set方法修改属性
	p.SetName("李四")
	p.SetCity("上海")
	if err := p.SetAge(30); err != nil {
		fmt.Println("设置年龄失败:", err)
	}

	fmt.Println("修改后:", p.String())
	// 输出: 修改后: Person{name=李四, age=30, city=上海}

	// 尝试设置非法年龄
	if err := p.SetAge(200); err != nil {
		fmt.Println("错误:", err)
		// 输出: 错误: 年龄不合法: 200
	}
}

```
