# Container Flask for Forester

## 功能概述

- 基于Flask，提供数据仪表盘的整体展示，并集成了xunserch和scrapyd的入口
- 集成了Gunicorn作为web服务器，基于80端口提供http访问服务
- 集成了supervisord提供进程健康服务检测

## 目录结构

``` bash
flask
├── Dockerfile                                                      // 镜像构造文件
├── requirements.txt                                                // 构造image的python依赖库，在创建container时自动安装
├── supervisord.conf                                                // supervisord和Gunicorn的配置文件
├── app                                                             // 用户程序文件目录
│   ├── main.py                                                     // 主入口程序，设置所有url路径和对应的渲染函数
│   ├── charts.py                                                   // 图表类页面的渲染函数
│   ├── views.py                                                    // 数据页面的渲染函数，通过`main.py`使用app.add_route_rule方法实现动态添加
│   ├── models.py                                                   // 数据库的接口函数，定义所有的SQL语句，注意MongoDB的引擎设置也在其中
│   ├── settings.py                                                 // 主配置文件，用于保存flask所需要的配置，包含MONGO_URI等参数
│   ├── uwsgi.ini                                                   // uwsgi网关的配置文件，用于连接Nginx和Flask
│   ├── static                                                      // 存放所有静态文件的目录，这也是Flask唯一存放静态文件的目录
│   │   ├── bootstrap3                                              // Bootstrap的库文件目录，包含css和js，当前版本3
│   │   ├── dashboard.css                                           // 仪表盘的CSS配置文件
│   │   ├── images                                                  // 自定义图标文件的存储目录
│   │   │   └── logo.png                                            // SJ的logo
│   │   └── js                                                      // HTML需要引用的JS库文件
│   │       ├── echarts.min.js                                      // 百度的echarts库文件，当前版本0.5.3
│   │       └── jquery-1.12.4.min.js                                // Jquery库文件，当前版本1.12.4
│   └── templates                                                   // 自定义HTML页面的模版目录，基于jinja2
│       ├── base.html                                               // 最基础的HTML框架
│       ├── index.html                                              // 仪表盘的框架模版
│       ├── pagination.html                                         // 数据分页模版，AJAX动态展现
│       └── pyecharts.html                                          // 几个图表页面的基础模版
└── README.md                                                       // 本文件
```

## 启动方式

- 从docker-compose中自动启动，等待外部http访问

## 注意事项

- 原来的第三方集成容器[tiangolo/uwsgi-nginx-flask-docker](https://github.com/tiangolo/uwsgi-nginx-flask-docker)已被废弃
