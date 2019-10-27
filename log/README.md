# Container Log for Forester

## 功能概述

- 实现集中管理各个容器的syslog，对外监听`10154`端口，并需要在集成环境中指向宿主机的端口`localhost:8514`
- 本服务集成了基础镜像[goharbor/harbor-log:v1.9.0](https://hub.docker.com/layers/goharbor/harbor-log/v1.9.1/images/sha256-c30459ee4275858d5094ce9774acb4fcaaa211be4e530ea13df4cda0a925a873)，

## 目录结构

``` txt
log
├── README.md                   // 本文件
├── logrotate.conf              // 必选项：设置log文件大小和轮询方式，避免空间溢出
├── rsyslog.conf                // 样板文件：docker中rsyslog的基础配置文件，文件位于`/etc/rsyslog.conf`
└── rsyslog_docker.conf         // 样板文件：docker中rsyslog的站点配置文件，文件位于`/etc/rsyslog.d/rsyslog_docker.conf`
```

## 注意事项
