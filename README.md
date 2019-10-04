# Forester项目

## 概述

## 安装方式（基于GitHub）

1. 将本地开发环境上传GitHub
2. 生产机（已安装docker，python3.6不是必须的）下载clone源代码`git clone xxxx`，并改名为`/app`
3. 新建`/data`数据目录及子目录`db/`，`xunsearch/`，可以用migration脚本迁移mongo DB数据（可选）
4. 启动预安装程序`sh prestart.sh`，并启动主程序`docker-compose up -d --build`
5. 浏览器远程访问<www.caogo.cn>

## 目录结构

- `nginx/`: 站点主入口，分别导流至scrapy、flask、xunsearch，并支持https和http重定向
- `scrapy/`：后台scrapy应用，运行环境集成了scrapyd(:6800)和scrapy_client，其中`app/`存放python应用
- `falsk/`：前台flask应用，运行环境集成了uWSGI和nginx，其中`app/`存放python应用
- `xunsearch/`: 中文搜索引擎，运行环境包括后台server和前台php(:9000)，其中`app/`存放php应用
- `mongo/`：公共数据库应用，其中`migarion/`包含样本数据和数据库迁移脚本，`scripts/`包含应用系护的一些脚本，如数据转换
- `crontab/`：后台定时任务调度，为scrapy提供服务，运行环境集成了docker for docker
- `/data`:用户数据目录，包括db、xunsearch等，注意VCS和GitHub不包含该目录。</font>  
- `prestart.sh`: 预启动程序，负责设置network并启动mongo，*注意：本地开发测试增加-dev参数，提供mongodb外部访问*
- `docker-compose.yml`:主启动程序，自动加载scrapy、flask、xunsearch和crontab等全部容器

- `venv/`:python3.6的虚拟环境
- `.gitignore`：设置不需要上传Github的文件类型
- `setup.shell`：生产环境的安装示例文件
- `README-python2.md`：基于python2.7的自述文件
- `README.md`: 本文件

### 注意事项

- 数据目录/data不在/app中，需要手工创建并建立子目录db/，xunsearch/
- xunsearch的index独立于mongo，清除方法为：`docker exec -it xunsearch php /app/xs_clean_index.php` 或者直接清除`/data/xunsearch`
- 由于GitHub上已经用过cmccb2b的name，因此改名为cmccb2b_package
- ECS生产环境docker版本低，version＝2

## 版权说明

---

## 参考资料

### Docker && Docker-compose

- [docker-compose v2参考手册](https://docs.docker.com/compose/compose-file/compose-file-v2/)
- [dockerfile 参考手册](https://docs.docker.com/engine/reference/builder/#usage)

### Python

- [Python 3的语法手册](http://www.runoob.com/python3/python3-tutorial.html)
- [正则表达式的教程](https://www.cnblogs.com/wxshi/p/6827056.html)

### Mongo

- [Pymongo 3.6](https://docs.mongodb.com/getting-started/python/client/)
- [Mongo Shell Vs Scripts](https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/)
- [MongoEngine](http://docs.mongoengine.org/index.html)
- [Mongo Engine 官方文档](https://mongoengine-odm.readthedocs.io/)
- [Flask Mongo Engine 官方文档](https://flask-mongoengine.readthedocs.io/en/latest/)

### Scrapy

- [Scrapy官方文档](https://docs.scrapy.org/en/latest/index.html#)
- [Scrapy 0.25中文文档](http://scrapy-chs.readthedocs.io/zh_CN/latest/index.html)
- [scrapy-mongodb GitHub](https://github.com/sebdah/scrapy-mongodb)

### Flask

- [flask中文资料](http://docs.jinkan.org/docs/flask/)
- [flask官方网站](http://flask.pocoo.org/docs/0.12/)  
- [jinja2官方文档](http://jinja.pocoo.org/docs/2.10/)
- [werkzeug官方文档](http://werkzeug.pocoo.org/docs/0.14/)
- [Flask Extension](https://wizardforcel.gitbooks.io/flask-extension-docs/content/flask-babel.html)
- [Pyecharts的官方文档](http://pyecharts.org/#/zh-cn/flask)
- [Pyecharts的Github主页](https://github.com/pyecharts/pyecharts)

### Bootstrap

- [Bootstrap中文文档](https://v4.bootcss.com/docs/4.0/getting-started/introduction/)
- [pyecharts图形控件](http://pyecharts.org/#/zh-cn/)
- [HTML便签](http://www.runoob.com/html/html-quicklist.html)
- [CSS手册](http://www.runoob.com/css/css-tutorial.html)
- [javascript手册](http://www.runoob.com/js/js-tutorial.html)

### 迅搜xunsearch

- [xunsearch的下载地址](http://www.xunsearch.com/site/download)  
- [xunsearch的参考文档](http://www.xunsearch.com/doc/php/guide/start.overview)

### GitHub

- [Flask Mongo Engnie 源代码](https://github.com/MongoEngine/flask-mongoengine)
- [tiangolo/uwsgi-nginx-flask:python2.7：基础镜像，集成了flask、uwsgi、nginx](https://github.com/tiangolo/uwsgi-nginx-flask-docker)
- [Docker for mongo/3.6](https://github.com/docker-library/mongo/tree/a504b49bb5cf896fbf3640b4b8cb0d09a25b53ae/3.6)
- [Mongo engine 源代码](https://github.com/MongoEngine/mongoengine)

### 杂七杂八

- [Mongo Shell](https://docs.mongodb.com/manual/mongo/)
- [Pymongo/3.6](http://api.mongodb.com/python/current/index.html)
- [Nginx的config配置](http://seanlook.com/2015/05/17/nginx-install-and-config/)
- [Nginx配置自签名的ssl证书](https://www.liaoxuefeng.com/article/0014189023237367e8d42829de24b6eaf893ca47df4fb5e000)
- [dockerfile中COPY多级目录的错误](https://blog.csdn.net/chent86/article/details/78607319)
- [scrapyd](http://scrapyd.readthedocs.io/en/stable/)
  