---
lang: zh-CN
title: systemctl部署
description: systemctl是 systemd 的核心工具，用于管理 Linux 系统服务。它将应用程序作为后台服务运行，支持自动重启、日志管理、依赖控制等特性。
date: 2026-01-22
category:
  - Linux
tag:
  - 部署
---
# systemctl部署
## 一、核心命令
``` shell
# 服务生命周期管理
systemctl start   <服务名>    # 启动服务
systemctl stop    <服务名>    # 停止服务
systemctl restart <服务名>    # 重启服务
systemctl reload  <服务名>    # 重载配置（不重启）

# 状态与信息
systemctl status  <服务名>    # 查看详细状态
systemctl is-active <服务名>  # 检查是否运行中
systemctl is-enabled <服务名> # 检查是否开机自启

# 开机自启管理
systemctl enable  <服务名>    # 设置开机自启
systemctl disable <服务名>    # 禁用开机自启

# 查看所有服务
systemctl list-units --type=service           # 正在运行的服务
systemctl list-units --type=service --all     # 所有服务
systemctl list-unit-files --type=service      # 查看启用状态

```

## 二、部署实战：创建自定义服务
### 1. 创建服务单元文件
- 在  /etc/systemd/system/  目录创建  .service  文件：
``` shell
sudo vim /etc/systemd/system/myapp.service
```
### 2.编写服务配置
``` shell
[Unit]
Description=My Go Application
# 描述服务
After=network.target
# 在网络启动后运行
Wants=network-online.target
# 确保网络可用
[Service]
Type=exec
# 推荐使用 exec，进程直接运行
ExecStart=/usr/local/bin/myapp -config /etc/myapp/config.yaml
# 启动命令（必须使用绝对路径）
WorkingDirectory=/opt/myapp
# 工作目录
Restart=always
# 总是自动重启
RestartSec=5
# 重启间隔 5 秒
User=appuser
# 运行用户（建议非 root）
Group=appuser
# 运行用户组
Environment="APP_ENV=production" "LOG_LEVEL=info"
# 环境变量
LimitNOFILE=65536
# 文件描述符限制
[Install]
WantedBy=multi-user.target
# 在多用户模式下启用
```

### 3.重新加载配置并启动
``` shell
# 重新加载 systemd 配置
systemctl daemon-reload
# 启动并设置开机自启
systemctl enable --now myapp.service
# 查看状态
systemctl status myapp

# 查看实时日志
journalctl -u myapp -f
# 实时跟踪
journalctl -u myapp -f
# 最近 100 行
journalctl -u myapp -n 100
# 今天以来的日志
journalctl -u myapp --since today
# 按时间范围
journalctl -u myapp --since "2024-01-01 00:00:00" --until "2024-01-02 00:00:00"

```