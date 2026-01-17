---
lang: zh-CN
title: 移动H5部署
description: 用于指导一线工程师部署联软移动H5页面进行审批
date: 2026-01-16
category:
  - 部署
tag:
  - 移动H5
---

# 移动H5部署
提示：H5 包已经集成在 kb 包中，只需要修改相关配置文件。

## 1.挂载目录查看
```shell
cat /etc/LeagView.conf
#path=挂载目录
path=/opt/leagsoft 
product=LeagView
user=leagsoft
processctrl=root
```

## 2.配置前端H5配置文件
复制配置文件并进行修改
```shell
cp -p 挂载目录/LeagView/nginx/html/approval/h5/static/config-dev.js 挂载目录/LeagView/nginx/html/approval/h5/static/config.js
vi config.js
```

配置h5-pro，配置此参数需要在地址栏带上审批员，例如 ehr=审批员

![](https://cdn.nlark.com/yuque/0/2025/png/40933698/1744803181179-d28d1d5c-02a5-4506-bee6-5972368d0fa1.png)

## 3.修改nginx配置，并重启nginx配置
```shell
vi 挂载目录/LeagView/nginx/conf/server/30098_server.conf
```

带上框线参数

```shell
  location /approval/h5 {
    root ./html;
    index index.html index.htm;
  }
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/40933698/1744803368448-ea2a20f5-6d18-4b03-a210-d492468d9323.png)

```shell
挂载目录/LeagView/nginx/sbin/LeagViewNginx_docker restart
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/40933698/1744803490878-66d58af8-af15-4295-9e19-a59a00052da4.png)



## 4.访问H5前端页面
需要结合场景判断是否需要开启密码登录：<font style="color:#DF2A3F;">InterfacePwdCheck=true</font>
目前只有emm支持账号密码登录

```shell
vi 挂载目录/LeagView/Ini/config.properties
```

[http://10.19.19.23:30098/approval/h5](http://10.19.19.23:30098/approval/h5/?ehr=cn#/pages/index/index)

带审批员：http://10.19.19.23:30098/approval/h5/?ehr=审批员账号



## 5.部署WMS，开启H5预览功能
1.下载WMS包：
[http://10.8.98.22:8888/develop/20250630SP.41/](http://10.8.98.22:8888/develop/20250630SP.41/)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/40933698/1744876283259-37fdd25b-22cc-4242-b172-890745e58578.png)

安装命令示例：./install-20250630SP.41.exe -i 10.200.55.53 -l 10.200.55.53  -g 172.33.0.1/24

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/40933698/1744871850259-30939109-5edd-4cd9-a79d-4dcdaffc278d.png)

安装成功显示内容：

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/40933698/1744871863128-88a6bea9-85ce-45dd-9e4c-8f808de34fe3.png)



2.配置前端预览配置（集成部署末尾追加）：
```shell
vi 挂载目录/LeagView/Ini/config.properties
```

> #水印方案名称
>
> newWmsWatermarkname=empty
>
> #支持预览文件
>
> newWmsSupportTypes=txt,doc,docx,xls,xlsx,ppt,pptx,pdf
>
> #WMS服务码，可以假值
>
> newWmsServiceCode=
>
> #WMS接口地址
>
> newWmsPath=http://127.0.0.1:9999/wms/
>
> #关闭H5审批页面“下载”，默认false
>
> #H5FileNotDownload=true
>
> #是否需要隐藏文件预览 ，默认false
>
> #H5FileNOTPreview=true
>

3.wms服务器设置白名单，独立部署:只用预览，可以配置白名单，新增xsource.dat加入ip，修改要重启docker，多个ip用分号隔开
在服务器/hhh/hdata下面的三个目录新增文件xsource.dat，把需要访问的ip加入文件中，多个ip用分号隔开。

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/40933698/1744876872981-e9d53552-8b1d-4df2-9aff-ba9150d6e324.png)

