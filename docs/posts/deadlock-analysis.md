---
lang: zh-CN
title: 数据库死锁与锁等待超时事故分析报告
description: 数据库死锁与锁等待超时
date: 2026-01-24
category:
  - 生产问题
tag:
  - 数据库
  - 死锁
  - 锁等待
---
## 📋 事故摘要

| 项目       | 详情                              |
| -------- | ------------------------------- |
| **事故编号** | DB-DEADLOCK-20260124-212058     |
| **事故时间** | 2026年01月24日 21:20:58 - 21:21:24 |
| **事故类型** | 数据库死锁与锁等待超时                     |
| **影响系统** | 主机和备机数据库更新脚本                    |
| **严重等级** | P1（严重）                          |

## ⚡ 事故时间线

### 关键事件序列

| 时间戳      | 主机状态             | 备机状态                  | 关键事件         |
| -------- | ---------------- | --------------------- | ------------ |
| 21:20:57 | 开始执行[68]步骤       | 执行[40-67]步骤           | 主机启动稍晚于备机    |
| 21:20:58 | [68]步骤完成(141ms)  | **正在执行[68]步骤**(864ms) | **执行速度差异出现** |
| 21:20:58 | [80]步骤死锁失败       | [68]步骤继续执行            | **死锁发生**     |
| 21:20:58 | [81],[82]步骤死锁    | [80]步骤成功(88ms)        | 主机连续失败       |
| 21:20:58 | [84]步骤开始创建存储过程    | [81]步骤成功(155ms)       | 主机开始长时间操作    |
| 21:21:04 | **[85]步骤调用数据复制存储过程中**      | **[82]步骤锁等待超时**           | **备机被阻塞**        |
| 21:21:24 | [85]步骤完成(25.61s) | 后续步骤继续执行              | 主机恢复         |

## 🔍 根本原因分析

### 1. **直接原因：MDL锁竞争**

**冲突操作对比：**

| 操作节点       | 操作内容                                                                | 执行时间   | 锁需求   |
| ---------- | ------------------------------------------------------------------- | ------ | ----- |
| **备机[68]** | `ALTER TABLE tbl_organization ALTER COLUMN iroletype SET DEFAULT 1` | 864ms  | MDL写锁 |
| **主机[80]** | `call add_index_if_not_exists('tbl_organization', ...)`             | 死锁立即失败 | MDL写锁 |


### 2. 具体锁等待触发过程

| 阶段 | 时间范围 | 主机操作 | 备机操作 | 锁冲突详情 |
|------|----------|----------|----------|------------|
| **阶段1：锁等待开始** | 21:20:58 | `call copy_organization()`开始 | `ALTER TABLE tbl_organization...`执行中 | 主机需要读取表数据 |
| **阶段2：数据锁持有** | 21:20:58-21:21:24 | `INSERT INTO tbl_p6_alarmconnector SELECT * FROM tbl_alarmconnector` | 准备执行DDL | 主机持有了tbl_alarmconnector的数据读锁 |
| **阶段3：MDL锁请求** | 21:20:59 | 数据复制持续进行 | `call add_column('tbl_alarmconnector', ...)` | 备机需要MDL写锁修改表结构 |
| **阶段4：单向等待** | 21:20:59-21:21:04 | 持续持有数据锁 | 等待MDL写锁 | MDL写锁请求被数据读锁阻塞 |
| **阶段5：超时触发** | 21:21:04 | 数据锁仍持有 | 等待超时5.01秒 | `Lock wait timeout exceeded` |

### 3. **死锁形成机制**

#### 第一阶段：锁资源竞争（21:20:58）

```
备机：持有 tbl_organization 表的MDL写锁（执行[68]步骤，864ms）
主机：需要获取 tbl_organization 表的MDL写锁（执行[80]步骤创建索引）
      ↓
主机：等待备机释放MDL写锁
```

#### 第二阶段：循环等待形成

主机在等待MDL锁的同时，脚本继续执行了[85]步骤：

```sql
call copy_organization();  -- 耗时25.61秒
```

该操作持有了`tbl_organization`表的数据读锁，形成了循环等待：

```
主机：持有数据读锁 → 等待MDL写锁（用于创建索引）
备机：持有MDL写锁 → 完成后可能需要数据锁（用于后续DDL操作）
```

### 4. **存储过程执行分析**

#### `add_index_if_not_exists` 存储过程锁获取顺序：

```sql
-- 第一步：查询INFORMATION_SCHEMA.STATISTICS（需要MDL读锁）
SELECT * FROM INFORMATION_SCHEMA.STATISTICS
WHERE LOWER(TABLE_NAME) = LOWER('tbl_organization')
AND LOWER(INDEX_NAME) = LOWER('idx_tbl_organization_uiddomainid');

-- 第二步：执行ALTER TABLE ADD INDEX（需要MDL写锁）
SET @indexsql = 'alter table tbl_organization add index ...';
PREPARE stmtindex FROM @indexsql;
EXECUTE stmtindex;
```

``` sql
/** 需要读锁执行时间25s */
CREATE TABLE if not exists tbl_p6_organization like tbl_organization ;
          CREATE TABLE if not exists tbl_p6_alarmconnector like tbl_alarmconnector;
          /** 复制组织架构数据到p6 */
          DROP PROCEDURE IF EXISTS copy_organization;
          CREATE PROCEDURE copy_organization()
          begin
          if not exists (select 1 from tbl_p6_organization where uidroleid='1') then
          insert into tbl_p6_organization select * from tbl_organization;
          insert into tbl_p6_alarmconnector select * from tbl_alarmconnector;
          end if;
          end
```

## 📊 错误类型对比分析

| 特性       | 主机（死锁）                                   | 备机（锁等待超时）                    |
| -------- | ---------------------------------------- | ---------------------------- |
| **错误信息** | `Deadlock found when trying to get lock` | `Lock wait timeout exceeded` |
| **发生步骤** | [80],[81],[82]创建索引和添加列                   | [82]添加列操作                    |
| **响应机制** | 数据库主动检测并立即回滚                             | 等待超时后强制回滚                    |
| **等待时间** | 立即失败（毫秒级）                                | 等待5.01秒后超时                   |
| **根本原因** | 循环等待资源                                   | 单向等待资源释放                     |

# 
