# Container Proxy for Forester

## 功能概述

- Mongo数据库自带搜索功能，但不支持中文分词，为此独立部署了迅搜服务
- Xunserch是一个中文搜索引擎，包含了前台、后台两个服务镜像，前台仅支持PHP语言

## 目录结构

``` txt
proxy
├── Dockerfile                      // 反向代理镜像的构造文件、
├── nginx.conf                      // 反向代理的Nginx配置文件
└── README.md                       // 本文件
```

## 注意事项

- 一般来说，容器上的proxy提供http的反向代理服务即可，https的加密处理统一交给生产主机的Nginx网关
- 本Nginx配置文件只适用与生产环境，因为仪表盘的scrapyd和xunsearch的链接地址是生产域名，但flask正常展示
