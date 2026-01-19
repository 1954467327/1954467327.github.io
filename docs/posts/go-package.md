---
lang: zh-CN
title: Go项目打包以及部署
description: 本文章讲述Go项目如何打包，以及打包后需要如何部署运行
date: 2026-01-20
category:
  - Goland
tag:
  - 部署
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
GOOS=linux GOARCH=amd64 go build main.go
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
## 部署
1. 可以通过docker进行部署
2. 通过systemctl操作系统管理部署
3. 后台执行： **nohup 可执行文件 &** ；