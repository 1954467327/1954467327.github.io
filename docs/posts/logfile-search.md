---
lang: zh-CN
title: Linux日志排查命令
description: 由于日志内容的复查情况以及某些模块存在日志量巨大，需要实时复现才好查看日志
date: 2026-01-21
category:
  - Linux
tag:
  - 日志排查
---

# Linux日志排查命令
由于日志内容的复查情况以及某些模块存在日志量巨大，需要实时复现才好查看日志，可以通过此文章命令排查
## 一、tail
### 1. 服务启动日志监控
``` shell
# -f (follow)：实时追加显示文件尾部内容 -n 末尾多少行
tail -f logs/application.log
# 合并命令
tail -200f logs/application.log
```
## 二、less
### 1.按需加载查看
如果需要查看之前的日志，推荐使用 less。不同于 vim 会一次性加载整个文件占用大量内存，less 是按需加载，打开几个 G 的文件也极其流畅，且支持向后回溯，以下命令vi进入编辑器也支持。

``` shell
less logs/application.log
```

进入界面后的操作流：
1. Shift + G 先跳到日志最末尾（因为报错通常发生在最近）。
2. ?ORD12345678 输入问号+订单号，向上反向搜索。
3. n：如果当前这行不是关键信息，按 n 继续向上找上一次出现的位置
4. Shift + n 查看下一行
5. Shift + F 如果看着看着，日志又更新了，按这个组合键可以让 less 进入类似 tail -f 的实时滚动模式；按 Ctrl + C 退回浏览模式。
6. q 退出

## 三、grep
### 1. 查找指定关键字的前后20行
``` shell
# 搜索异常关键字，并显示该行 "前后各 20 行"
grep -C 20 "Exception" application.log
```
### 2. 全链路追踪 TraceId
微服务我们通常会通过 TraceId 串联请求。日志文件可能发生了滚动（Rolling），变成了 app.log、app.log.1、app.log.2。

我们需要在所有日志文件中搜索同一个 TraceId。
``` shell
# 搜索当前目录下所有以 app.log 开头的文件
grep "TraceId-20251219001" logs/app.log*
```

### 3. 统计异常频次
``` shell
# -c (count)：只统计匹配的行数
grep -c "RedisConnectionException" logs/application.log
```

### 4. 排除干扰噪音
排查问题时，日志里充斥着大量无关的 INFO 心跳日志或健康检查日志，严重干扰视线。
``` shell
# -v (invert)：显示不包含 "HealthCheck" 的所有行
grep -v "HealthCheck" logs/application.log
```

## 四、sed
### 1. 导出事故时间窗口的日志
有时候日志非常大，例如有 10GB，grep 搜出来的内容依然过多。如果我们明确知道生产事故发生在 14:00 到 14:05 之间，该怎么办？

下载整个日志不现实，sed 可以帮我们把这段时间的日志单独切出来，保存成一个小文件慢慢分析。
``` shell
# 语法：sed -n '/开始时间/,/结束时间/p' 源文件 > 目标文件
#       sed -n '/pattern1/,/pattern2/p' filename
# 注意：时间格式必须和日志里的格式完全一致

# 提取从 00:01:00 到 00:02:00 的日志（同一天）
sed -n '/^2026-01-22 00:01:/,/^2026-01-22 00:02:/p' uniweb-global-setting.log > error_segment.log

# 或者更精确的时间范围（包含毫秒）
sed -n '/^2026-01-22 00:01:00\.003/,/^2026-01-22 00:02:00\.000/p' uniweb-global-setting.log > error_segment.log

# 提取从 1月21日 到 1月22日的日志
sed -n '/^2026-01-21/,/^2026-01-22/p' uniweb-global-setting.log > multi_day_logs.log
```

## 五、 Awk
awk 擅长处理列数据，对于格式规范的日志，如 Nginx 访问日志、Apache 日志，它可以直接在服务器上生成简报。
### 1. 遭到攻击，查找恶意 IP
服务突然报警 CPU 飙升，怀疑遭到 CC 攻击或爬虫抓取，我们需要分析 Nginx 日志，找出访问量最高的 IP。
``` shell
# 1. awk '{print $1}'：提取第一列（IP）
# 2. sort：排序，把相同的 IP 排在一起
# 3. uniq -c：去重并统计每个 IP 出现的次数
# 4. sort -nr：按次数(n)倒序(r)排列
# 5. head -n 10：取前 10 名

awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -n 10

[root@LV7000-CE791A logs]# awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -n 10
   9315 10.20.3.2
   4880 10.20.13.135
   3680 10.20.13.168
   3534 10.20.13.97
   1290 10.20.13.122
    656 127.0.0.1
    398 10.20.13.174
    223 10.20.24.106
     12 10.19.31.178
```

### 2. 找出响应最慢的接口
Nginx 日志中通常记录了响应时间，假设在最后一列，我们想把响应时间超过 1 秒的请求找出来。
``` shell
# $NF 代表最后一列,打印第12个字段和最后一个字段，用空格分隔
# 打印所有响应时间大于 1 秒的 URL（假设 URL 在第 12 列）
awk '$12 > 1.000 {print $12, $NF}' access.log

[root@LV7000-CE791A logs]# awk '$12 > 6000000 {print $12, $NF}' access.log
6917288 "https://10.19.31.166:8443/assets/index-300c691a.css"
HTTP/1.1" "-"
6917288 "https://10.19.31.166:8443/uni-app/assets/index-95ded47c.css"
6917288 "https://10.19.31.166:8443/uni-app/assets/index-95ded47c.css"
```

## 六、查看当前连接数
文件描述符限制（File Descriptor Limit）
每个 TCP 连接都会消耗一个文件描述符。操作系统对每个进程能打开的文件描述符数量有上限。
``` shell
# 查看某个进程的连接数（假设服务器监听 8080 端口）
lsof -i :8080 | wc -l

# 或使用 netstat（较老系统）
netstat -an | grep :8080 | wc -l
```

## 七、查看当前进程占用的内存
%mem：物理内存使用百分比
rss：Resident Set Size，实际使用的物理内存（KB）
vsz：Virtual Memory Size，虚拟内存大小（KB）
``` shell
# 通过进程名查找
ps aux | grep your_process_name

# 通过 PID 查看
ps -p <PID> -o pid,ppid,cmd,%mem,%cpu,rss,vsz

# 交互式查看
top

# 按内存排序
top -o %MEM

# 查看指定 PID
top -p <PID>
```