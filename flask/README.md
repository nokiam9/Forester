# Container Flask for Forester

## 功能概述

- 基于Flask，提供数据仪表盘的整体展示，并集成了xunserch和scrapyd的入口
- 基于80端口提供http访问服务，前端通过proxy集成反向代理

## 目录结构

``` bash
flask
├── Dockerfile                                                      // 镜像构造文件
├── README.md                                                       // 本文件
├── app                                                             // 用户程序文件目录
│   ├── main.py                                                     // 主入口程序，负责启动app并设置url路径和对应的函数
│   ├── charts.py                                                   // 图表页面的渲染程序
│   ├── views.py                                                    // 数据页面的渲染程序，在`main.py`使用app.add_route_rule方法添加
│   ├── models.py                                                   // 数据接口程序，存在所有的数据定义，注意MongoDB的引擎设置也在其中
│   ├── settings.py                                                 // 主配置文件，用于保存flask所需要的配置，包含mongo等
│   ├── uwsgi.ini                                                   // uwsgi网关的配置文件，用于连接Nginx和Flask
│   ├── static                                                      // 存放所有静态文件的目录，这也是flask唯一存放静态文件的目录
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
└── requirements.txt                                                // 构造image的python依赖库，在创建container时自动安装
```

## 启动方式

- 从docker-compose中自动启动，等待外部http访问

## 注意事项

- 修复pymongo的[connect偶尔失败的bug](https://www.cnblogs.com/dhcn/p/7121395.html),解决方法是MongoClient设置`connect＝False`，启动时不立即connect mongo
- 修改`main.py`，将@`app.route()`修饰符方式改为`app.add_url_rule()`方式，并将所有页面函数隐藏到`views.py`
- 增加查询专用index，解决pagination内存溢出问题
- `<a herf="#" onclick="gotoPage('2')">`标签等组件包含了默认动作，例如herf属性就会触发页面跳转，导致不需要的页面刷新，
可以通过控制return false的方式阻止默认动作的发生，具体参见[文档](https://www.cnblogs.com/weiwang/archive/2013/08/19/3268374.html) 
- 基于python3.6成功安装pyecharts，但alpine3.7报错很多

---

## TODO

- 需要设置`/app/logs`
  
- 主要功能：以容器形式封装flask，nginx和uwsgi
[基础镜像：tiangolo/uwsgi-nginx-flask-docker](https://github.com/tiangolo/uwsgi-nginx-flask-docker)
