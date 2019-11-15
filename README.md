# Forester项目

## 概述

基于b2b.10086.cn，提供数据爬取和展示功能  

以docker-compose方式，集成了scrapy、flask、xunsearch、mongo等组件

## 安装方式

- 生产机下载clone源代码`git clone xxxx`，并改名为`/app`
- 新建`/cmdata`数据目录，启动后自动创建子目录`db/`，`xunsearch/`, `download/`
- 启动主程序`docker-compose up -d --build`，可以通过`http://localhost:8080`提供基础功能
- 如果生产环境部署完成，浏览器远程访问<www.caogo.cn>

## 目录结构

``` txt
forester
├── .env                            // docker-compose默认的环境配置文件
├── .gitignore
├── docker-compose.yml              // 本项目的构造文件，启动方式`docker-compuse up -d --build`
├── proxy/                          // 站点主入口，分别反向代理至scrapy、flask、xunsearch
├── flask/                          // 前端Flask应用镜像，运行环境集成了uWSGI，其中`app/`存放python应用
├── log/                            // 集中管理syslog，集成镜像直接借用了goharbor/log:1.9.0
├── scrapy/                         // 后台Scrapy应用镜像，运行环境集成了scrapyd，其中`app/`存放python应用
├── xunsearch/                      // 中文搜索引擎，运行环境包括后台server和前台php，其中`app/`存放php应用
├── cronjobs/                       // 后台定时任务调度，为scrapy提供服务，运行环境集成了docker for docker
├── wait-for-ip.sh                  // 检测IP端口是否avaliable的shell脚本
├── wait-for-mongo.py               // 检测Mongo DB是否ready的python脚本
├── LICENSE
├── CHANGELOG.md                    // 记录版本更新的文档
├── DEPLOYMENT.md                   // 生产环境安装部署方式的文档
├── NOTES.md                        // 技术开发过程中的一些经验和技巧
└── README.md                       // 本文件

```

## 开发工具和环境要求

- docker==13
- docker-compose>=3.2
- python==3.6
- mongo==3.6

## 版权说明

---

## 参考资料

### Docker && Docker-compose

- [docker-compose v2参考手册](https://docs.docker.com/compose/compose-file/compose-file-v2/)
- [dockerfile 参考手册](https://docs.docker.com/engine/reference/builder/#usage)
- [dockerfile中COPY多级目录的错误](https://blog.csdn.net/chent86/article/details/78607319)

### Python

- [Python 3的语法手册](http://www.runoob.com/python3/python3-tutorial.html)
- [正则表达式的教程](https://www.cnblogs.com/wxshi/p/6827056.html)

### Mongo

- [Pymongo 3.6](https://docs.mongodb.com/getting-started/python/client/)
- [Mongo Shell Vs Scripts](https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/)
- [MongoEngine](http://docs.mongoengine.org/index.html)
- [Mongo Engine 官方文档](https://mongoengine-odm.readthedocs.io/)
- [Flask Mongo Engine 官方文档](https://flask-mongoengine.readthedocs.io/en/latest/)
- [Mongo Shell](https://docs.mongodb.com/manual/mongo/)
- [Pymongo/3.6](http://api.mongodb.com/python/current/index.html)

### Scrapy

- [Scrapy官方文档](https://docs.scrapy.org/en/latest/index.html#)
- [Scrapy 0.25中文文档](http://scrapy-chs.readthedocs.io/zh_CN/latest/index.html)
- [scrapy-mongodb GitHub](https://github.com/sebdah/scrapy-mongodb)
- [scrapyd](http://scrapyd.readthedocs.io/en/stable/)

### Flask

- [flask中文资料](http://docs.jinkan.org/docs/flask/)
- [flask官方网站](http://flask.pocoo.org/docs/0.12/)  
- [jinja2官方文档](http://jinja.pocoo.org/docs/2.10/)
- [werkzeug官方文档](http://werkzeug.pocoo.org/docs/0.14/)
- [Flask Extension](https://wizardforcel.gitbooks.io/flask-extension-docs/content/flask-babel.html)
- [Pyecharts的官方文档](http://pyecharts.org/#/zh-cn/flask)
- [Pyecharts的Github主页](https://github.com/pyecharts/pyecharts)
- [Gunicorn Document](http://docs.gunicorn.org/en/latest/run.html)

### Bootstrap

- [Bootstrap中文文档](https://v4.bootcss.com/docs/4.0/getting-started/introduction/)
- [pyecharts图形控件](http://pyecharts.org/#/zh-cn/)
- [HTML便签](http://www.runoob.com/html/html-quicklist.html)
- [CSS手册](http://www.runoob.com/css/css-tutorial.html)
- [javascript手册](http://www.runoob.com/js/js-tutorial.html)

### 迅搜xunsearch

- [xunsearch的下载地址](http://www.xunsearch.com/site/download)  
- [xunsearch的参考文档](http://www.xunsearch.com/doc/php/guide/start.overview)

### Log

- [rsyslog的Github主页](https://github.com/rsyslog/rsyslog/tree/v8-stable)
- [rsyslog的官方文档](https://www.rsyslog.com/doc/master/configuration/index.html)

### GitHub

- [Flask Mongo Engnie 源代码](https://github.com/MongoEngine/flask-mongoengine)
- [tiangolo/uwsgi-nginx-flask:python2.7：基础镜像，集成了flask、uwsgi、nginx](https://github.com/tiangolo/uwsgi-nginx-flask-docker)
- [Docker for mongo/3.6](https://github.com/docker-library/mongo/tree/a504b49bb5cf896fbf3640b4b8cb0d09a25b53ae/3.6)
- [Mongo engine 源代码](https://github.com/MongoEngine/mongoengine)

### 杂七杂八

- [Nginx的config配置](http://seanlook.com/2015/05/17/nginx-install-and-config/)
- [Nginx配置自签名的ssl证书](https://www.liaoxuefeng.com/article/0014189023237367e8d42829de24b6eaf893ca47df4fb5e000)
- [Supervisor官方主页](http://supervisord.org/running.html#running-supervisord)