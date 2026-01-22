---
lang: zh-CN
title: Go项目打包以及部署
description: 本文章讲述Go项目如何打包，以及打包后需要如何部署运行
date: 2026-01-20
category:
  - 后端
tag:
  - 部署
  - Goland
---
# Go项目打包以及部署
## go语言项目如何打包
### 1. 先查看go环境变量

```shell
litong@Mac uniweb-os %   go env
AR='ar'
CC='clang'
CGO_CFLAGS='-O2 -g'
CGO_CPPFLAGS=''
CGO_CXXFLAGS='-O2 -g'
CGO_ENABLED='1'
CGO_FFLAGS='-O2 -g'
CGO_LDFLAGS='-O2 -g'
CXX='clang++'
GCCGO='gccgo'
GO111MODULE='on'
GOARCH='arm64'
GOARM64='v8.0'
GOAUTH='netrc'
GOBIN=''
GOCACHE='/Users/litong/Library/Caches/go-build'
GOCACHEPROG=''
GODEBUG=''
GOENV='/Users/litong/Library/Application Support/go/env'
GOEXE=''
GOEXPERIMENT=''
GOFIPS140='off'
GOFLAGS=''
GOGCCFLAGS='-fPIC -arch arm64 -pthread -fno-caret-diagnostics -Qunused-arguments -fmessage-length=0 -ffile-prefix-map=/var/folders/wb/rhm_2yjd7gz219srmfb1wy_40000gn/T/go-build609036225=/tmp/go-build -gno-record-gcc-switches -fno-common'
# go build 的时候默认会根据这两个字段来打包
GOHOSTARCH='arm64'
GOHOSTOS='darwin'

GOINSECURE=''
GOMOD='/Users/litong/GolandProjects/uniweb-os/go.mod'
GOMODCACHE='/Users/litong/go/pkg/mod'
GONOPROXY=''
GONOSUMDB=''
```

### 2. 进入项目目录，执行go build main.go
系统架构：GOHOSTARCH='arm64'
操作系统类型：GOHOSTOS='darwin'
go会在当前目录根据环境变量自动生成可执行文件，如：main；可以通过sh main 执行即可。

#### 如果需要选择系统架构打包，可以自定义指定：
``` shell
# 交叉编译
GOOS=linux GOARCH=amd64 go build -o app-linux main.go
```
#### 查看go支持架构:go tool dist list
<操作系统>/<架构>
```shell
litong@Mac ~ % go tool dist list
aix/ppc64
android/386
android/amd64
android/arm
android/arm64
darwin/amd64
darwin/arm64
dragonfly/amd64
freebsd/386
freebsd/amd64
freebsd/arm
freebsd/arm64
freebsd/riscv64
...
```
## Go调度器三层结构
```
# GMP模型
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   G (协程)   │◄──►│  P (逻辑处理器) │◄──►│  M (系统线程) │
│  - 轻量级    │    │  - 执行上下文  │    │  - 内核线程  │
│  - 用户态    │    │  - 数量=GOMAXPROCS│    │  - 内核态    │
│  - 百万级    │    │  - 调度资源    │    │  - 千级      │
└─────────────┘    └──────────────┘    └─────────────┘
      │                   │                   │
      │ 1:N               │ 1:N               │ N:M
      │ (多个G绑定到P)     │ (多个P共享M池)     │ (多个M对应P)
```
1. GOMAXPROCS控制P的数量：
- P是逻辑处理器，是调度的基本单位
- 默认等于CPU核心数
- 决定同时执行的goroutine数量上限
2. P与M的关系：
- 每个P必须绑定到一个M才能执行G
- 空闲的P会释放其M，需要时再申请新的M
- M的数量通常远小于P的数量
3. G的调度：
- G存储在P的本地队列中
- 每个P维护一个本地G队列和一个全局G队列
- G在不同P之间迁移来实现负载均衡

## 运行时参数

### 设置GOMAXPROCS
- GOMAXPROCS控制Go运行时使用的逻辑处理器（P）数量，直接影响程序的并行能力
- 它决定了Go调度器可以同时运行的goroutine数量上限
- 默认情况下，Go 1.5+ 版本会自动设置为CPU核心数

GOMAXPROCS=4 ./myapp

### 内存限制
- 容器内存限制的80%
- 系统内存的75%
GOMEMLIMIT=512MiB ./myapp

### CPU性能分析
./myapp -cpuprofile=cpu.prof

### 内存分析
./myapp -memprofile=mem.prof

## 部署
1. 可以通过docker进行部署
2. 通过systemctl操作系统管理部署
3. 后台执行： **nohup 可执行文件 &** ；