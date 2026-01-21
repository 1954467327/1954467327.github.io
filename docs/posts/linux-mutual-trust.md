---
lang: zh-CN
title: linux互信
description: 此文档介绍互信的原理，并提供批量互信脚本支持一键对多个服务器进行单向互信，服务器密码可以使用统一密码也可以使用自定义密码
date: 2026-01-21
category:
  - linux
tag:
  - 互信
---

# linux互信
此文档介绍互信的原理，并提供批量互信脚本支持一键对多个服务器进行单向互信，服务器密码可以使用统一密码也可以使用自定义密码
## 1. 互信原理
### 1.1 SSH公钥认证机制
- Linux互信基于SSH协议的公钥认证机制，其核心原理是：
- 非对称加密：使用RSA或ED25519等算法生成公钥-私钥对
- 身份验证：客户端用私钥签名，服务端用公钥验证签名
- 免密登录：验证成功后无需输入密码即可建立SSH连接
### 1.2 工作流程
1. 客户端发起SSH连接请求
2. 服务端返回随机字符串(challenge)
3. 客户端用私钥对字符串进行数字签名
4. 服务端用存储的公钥验证签名
5. 验证通过 → 建立连接；验证失败 → 要求密码认证
### 1.3 互信类型
- 单向互信：A信任B，但B不信任A（A→B）
- 双向互信：A信任B且B信任A（A↔B）
- 多机互信：集群中所有节点相互信任

## 2. 互信的步骤
### 1.1 生成本地密钥
``` shell
# 参数说明：
# -t: 密钥类型
# -b: 密钥长度
# -N: 空密码短语
# -f: 指定密钥文件路径
ssh-keygen -t rsa -b 4096 -N ""

# 生成的.ssh 目录权限
drwx------  2 root root       4096 Jan 21 09:34 .ssh
# 生成的公私钥权限
-rw------- 1 root root 3381 Jan 21 09:34 id_rsa
-rw-r--r-- 1 root root  744 Jan 21 09:34 id_rsa.pub
```
### 1.2 分发公钥到目标服务器
``` shell
# 使用默认密钥分发 首次连接需要输入密码，后续免密
ssh-copy-id username@target_server_ip

# 实际执行
[root@LV7000-CE791A .ssh]# ssh-copy-id root@10.19.31.36
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/root/.ssh/id_rsa.pub"
The authenticity of host '10.19.31.36 (10.19.31.36)' can't be established.
ED25519 key fingerprint is SHA256:RbHHoMjGkBlFZVhRMX6YgKdGAGztZmxbEhqg6qqQcyY.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
#//////////////////////////////////////////////////////////////////////////////////////////////////##
# Without the owner's prior written consent,no decompiling or reverse-engineering shall be allowed.#
#                                                                                                  #
                                                                 #
#//////////////////////////////////////////////////////////////////////////////////////////////////#

root@10.19.31.36's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'root@10.19.31.36'"
and check to make sure that only the key(s) you wanted were added.


# 目标服务器.ssh目录权限
drwx------  2 root root       4096 Jan 21 09:39 .ssh
# 分发后只会生成authorized_keys
[root@LV7000-8F1E5F .ssh]# ls -la
total 12
drwx------ 2 root root 4096 Jan 21 09:39 .
drw------- 7 root root 4096 Jan 21 09:39 ..
-rw------- 1 root root  744 Jan 21 09:39 authorized_keys
```

## 3. 互信失败检测
1. 家目录 (~) :家目录本身不能对其他用户有写权限。
2. ssh目录 (~/.ssh) 必须是700
3. 私钥文件 (~/.ssh/id_rsa, ~/.ssh/id_ed25519等)：必须是 600。
4. 公钥文件 (~/.ssh/id_rsa.pub, ~/.ssh/id_ed25519.pub)：可以是 644或 600。644是标准且安全的。
5. 授权密钥文件 (~/.ssh/authorized_keys)：必须是 600。
### 3.1 客户端权限
``` shell
# 生成的.ssh 目录权限
drwx------  2 root root       4096 Jan 21 09:34 .ssh
# 生成的公私钥权限
-rw------- 1 root root 3381 Jan 21 09:34 id_rsa
-rw-r--r-- 1 root root  744 Jan 21 09:34 id_rsa.pub
```
### 3.2 服务端权限
``` shell
# 目标服务器.ssh目录权限
drwx------  2 root root       4096 Jan 21 09:39 .ssh
# 分发后只会生成authorized_keys
[root@LV7000-8F1E5F .ssh]# ls -la
-rw------- 1 root root  744 Jan 21 09:39 authorized_keys
```
## 4. 批量互信脚本
- PS：需要安装expect命令
- 生成本地密钥：判断当前服务器是否生产过密钥生成过则不在生成；
- 获取自定义密码：通过自定义密码和统一密码，优先使用自定义密码，否则从统一密码获取
- 分发：通过命令分发到其他服务器
``` shell
set -euo pipefail

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# 配置部分
HOSTS=(
"10.19.17.140"
"10.19.17.26"
#"82.204.80.20"
# 添加更多主机IP...
)
# 远程用户名
remoteUser="appuser"
#默认密码
DEFAULT_PASSWORD=App753951+
#自定义密码
declare -A HOST_PASSWORDS=(
	["10.19.17.140"]="XCtsat@2025aaa"
	["10.19.17.26"]="Tiao@lv7aa000"
)
# 安全提示函数
safe_prompt() {
    local prompt=$1
    local var_name=$2
    read -s -p "$prompt" "$var_name"
    echo
    echo "密码已输入（脱敏显示）"
}

# 1. 生成本地RSA密钥
generate_local_key() {
    echo -e "${GREEN}[步骤1] 检查本地RSA密钥...${NC}"
    if [ ! -f ~/.ssh/id_rsa ]; then
        echo "正在生成本地RSA密钥..."
        ssh-keygen -t rsa -b 4096 -N ""
        echo "本地密钥已生成: ~/.ssh/id_rsa"
    else
        echo "本地密钥已存在，跳过生成"
    fi
}


# 2. 建立互信
setup_trust() {
    local host=$1
    local password=$(get_password "$host")
    
    echo -e "\n${GREEN}[步骤2] 与主机 $host 建立互信...${NC}"
    
    # 上传本地公钥到远程
    expect << EOF
    set timeout 30
    spawn ssh-copy-id ${remoteUser}@${host}
		expect {
		"yes/no" { send "yes\r"; exp_continue }
		"password:" { send "$password\r"; exp_continue }
		"Permission denied" {
				puts stderr "错误: 主机$host 密码错误!"
				exit 1
			}
		eof
	}
EOF
}

# 获取密码
get_password() {
	local host=$1
	if [ -n "${HOST_PASSWORDS[$host]:-}" ]; then
		echo "${HOST_PASSWORDS[$host]}"
	else
		echo "${DEFAULT_PASSWORD}"
	fi

}

# 主流程
main() {
    # 生成本地密钥
    generate_local_key
    
    # 批量处理远程主机
    for host in "${HOSTS[@]}"; do
        echo -e "\n${GREEN}>>> 开始处理主机: ${host} <<< ${NC}"
        # 建立互信
        setup_trust "${host}"
        
        echo -e "${GREEN}主机 ${host} 配置完成!${NC}"
    done
    
    echo -e "\n${GREEN}所有主机配置完成!${NC}"
}
#执行主流程
main

```