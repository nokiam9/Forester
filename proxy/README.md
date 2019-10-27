# Container Proxy for Forester

## 功能概述

- 提供主服务入口，为各个容器提供反向代理服务
- 目前集成了xunsearch、scrapyd、flask等三个子站点

## 目录结构

``` txt
proxy
├── Dockerfile                      // 反向代理镜像的构造文件（已废弃）
├── nginx.conf                      // 反向代理的Nginx配置文件
└── README.md                       // 本文件
```

## 注意事项

- 一般来说，容器上的proxy提供http的反向代理服务即可，https的加密处理统一交给生产主机的Nginx网关
- 本Nginx配置文件只适用与生产环境，flask可以正常展示
- xunsearch、scrapyd由于HTML中写死了域名，如需测试只能修改`docker-compose.yml`，并以`http://localhost:6800`或`http://localhost:8000`方式访问
