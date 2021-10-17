# Forester 版本记录

## 发布版本0.5.3，2021/10/17

- 修复某个图标的位置

## 发布版本0.5.2，2021/10/17

- 根据监管要求，主页增加ICP备案信息

## 发布版本0.5.1，2020/12/6

- b2b网站采用某数的反爬技术，很高级！千辛万苦找到了TamperMonkey的新方案
- Scrapy已经没用了，docker-compose中停用该服务
- 增加tm-scripts目录，存放TM脚本，当前版本0.75
- Flask增加了一个POST服务，用于TM提交数据

## 发布版本0.4.1，2019/12/28

- 根据政府监管要求，被迫增加ICP注册信息

## 发布版本0.4，2019/11/15

- 新建Container:`forester-log`，实现syslog的集中管理。
  - 基本原理：服务容器`forester-log`开启服务`rsyslogd`，默认端口`10514`。
  - 将rsyslogd的服务端口映射为宿主机的端口，并设置以UDP/TCP方式将对象容器的syslog输出到`localhost:8514`。
  - log数据统一存储在`../cmdata/log/`目录

- 新增`wait-for-mongo.py`：用于检查mongo db是否ready。  
  - 需要在容器服务中加载该文件，调整command命令，并确认已安装python3和pymongo组件
  - 默认URI为环境变量`$MONGODB_URI`
  
  ``` console
  $ python3 ./wait-for-mongo.py -h
  usage: wait-for-mongo.py [-h] [--uri URI] [-t TIMEOUT] [-q] [command] ...

  positional arguments:
    command               Command should be excuted after starting Mongo
    args                  Arguments for this command, if existed

  optional arguments:
    -h, --help            show this help message and exit
    --uri URI             Mongodb URI, default get from $MONGODB_URI
    -t TIMEOUT, --timeout TIMEOUT
                          set waiting time with seconds, default is 30
    -q, --quiet           set quiet mode without output, default is False
  ```

- 新增`wait-for-ip.sh`：用于检测IP:PORT是否ready。
  - 需要在容器服务中加载该文件，调整command命令，并确认已安装nc命令
  - nc的安装方法：`apt-get install netcat` 或者 `apk add netcat-openbsd`
  
  ``` console
  $ sh ./wait-for-ip.sh localhost:8000
  Usage:
    wait-for-ip.sh host:port [-t timeout] [-- command args]
    -q | --quiet                        Do not output any status messages
    -t TIMEOUT | --timeout=timeout      Timeout in seconds, zero for no timeout
    -- COMMAND ARGS                     Execute command with args after the test finishes
  ```
  
- 简化Xunsearch-server和Proxy的容器构造方式，直接采用基础镜像并挂载配置文件
- 设置`docker-compose.yml`的`depend on`容器依赖关系

---

## 发布版本0.3, 2019/10/20

- 由于原PHP 5.5.9版本存在安全问题，无法继续支持mongodb扩展的问题，将PHP升级为7.2，为此重构`xunsearch.dockerfile`。  
    现在基础镜像是`php:7.2-apache`，并简化了构造文件。
- Github给出严重安全告警，原因是V0.2中Scrappy-Python-Twisted强制规定的版本17.9存在安全漏洞，反复测试版本兼容性，确认以下配置通过：

  - `requirement.txt`配置文件，scrapyd 1.2的web界面有所变化，`items`栏目被取消

    ``` ini
    Twisted==19.7
    scrapy==1.6.0
    scrapyd==1.2.1
    ```

  - `scrapyd.conf`配置文件中，`bind_address = 0.0.0.0`，注意后面不得增任何字符或注释
  - 现在Scrapy的基础镜像可以使用`Python:3.6-slim`版本
  
- 运行php的app应用时，header强制定义`content-type`时给出提示告警，暂时屏蔽该语句。

## 发布版本0.2, 2019/10/8

- Flask废弃nginx+uwsgi模式，改为Supervisord+Gunicron的轻模式，base image改为`python:3.6-slim`，镜像体积减少到200M+ !!!  
  - Gunicron似乎不允许80端口绑定，现在Flask服务端口是8000  
  - 删除`uwsgi.ini`，现在配置文件是`supervisord.conf`,并且调整到Dockerfile所在目录  

- 确认Scrpayd的bug来自于Twisted的高版本兼容性，要求Twisted<=17.9；同时，由于Twisted的安装要求，Scrapy的基础镜像只能用python 3.6或者3.6-jessia

- Pyecharts现在的1.x版本，与项目采用的0.5x存在不兼容的问题

## 发布版本0.1.1, 2019/10/5

- 启动Forester的版本开发，版本号记录在`~/.env`文件中
  
- Mongo数据库改为鉴权方式并整合到组件中
  - 初始化用户名和口令配置在docker-compose的`.env`文件中，容器可以通过环境变量引入  
  - 单机开发需要连接数据库时，可以修改yml配置并单独启动mongo服务`docker-compose run --service-ports -d mongo`（如需要，可以设置MONGODB_URI环境变量）

- 在v0.1基础上，修改了`Scrapy/settings.py`的一个小错误

---

## Bug修复(已归档)

### Patch-101, 2018/8/10

- 网站升级，增加了`User-Agent`格式和`Referer`跨站脚本的检测功能，并调整了notice_type
  
### Patch-102, 2019/5/30

- 网站升级，Ajax的formdata增加_qt字段，键值隐藏在主HTML中，同时增加了Cookie检测。  
为此增加了`pre_parse()`步骤，读取主HTML中_qt的内容，并填充到`parse()`的formdata字典

### Patch-103, 2018/08/22

- 站点再次升级反爬虫策略，将qt隐藏在js脚本，并增加注释语句混淆信息

---

### Todo
