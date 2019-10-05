# Container Cronjobs for Forester

## 功能概述

- 定义并定时启动本项目各个容器的定时任务
- 计划将来在K8s集群方式，直接改造为jobservices模式
  
- 安装了scrapyd，基于6800端口提供scrapy的调度服务

## 目录结构

``` txt
cronjobs
├── Dockerfile                  // cronjobs镜像的构造文件，补充安装了curl
├── config.json                 // 用户自定义，以json格式描述的定时任务清单
├── config.sample.json          // 任务清单的样板文件，支持远程启动其他container的命令行
└── README.md                   // 本文件
```

## 注意事项

- 启用本容器需要加载`/var/run/docker.sock`（宿主机的套接字）以支持docker in docker，但现在已改为curl方式，更加安全
  