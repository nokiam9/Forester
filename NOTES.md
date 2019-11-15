# 一些有用的开发技巧

## `Linux`：非常有用的指令

- `lsof -i`  
  查看系统端口被那个进程占用
- `netstat -tunlp`  
  显示tcp，udp的端口和进程等相关情况
- `lsb_release`  
  显示LSB和特定版本的相关信息 ,LSB是Linux Standard Base的缩写

## `Git`：

- 发现问题：git管理的文件名称改为大写，但显示没有可以提交的修改  
  原因分析：由于需要支持Windows等操作系统，git对文件名的大小写不敏感  
  解决方法：先改个不同的大写名字并提交，再改回正常的大写文件名并提交

## `Docker & Docker-Compose`：经验之谈

- 如何在docker-compose中设置操作系统的环境变量

  - 首先，在docker-compose的配置文件目录，编辑默认环境文件`.env`，并在该文件中定义需要的变量。  
    注意：这些变量只能在`docker-compose.yml`中被引用

    ``` txt
    __VERSION__=1.0

    F6R_MONGO_USERNAME=root
    F6R_MONGO_PASSWORD=forester
    ```

  - 然后，在`docker-compose.yml`中就可以导入`.env`文件中定义的环境变量

    ``` yml
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${F6R_MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${F6R_MONGO_PASSWORD}
    ```

- `docker in docker`的原理是在container通过socket的套接字通信，将指令转发给宿主机的2375监听端口，并执行docker命令。  

  这里是[Github官方主页](https://github.com/docker-library/docker)。
  使用方法参见[参考文档](https://zhuanlan.zhihu.com/p/26413099)

- `docker-compose`设置镜像依赖关系的[官方建议](https://docs.docker.com/compose/startup-order/)

---

## `Python`：管理和开发技巧

- `viutual python`虚拟环境的管理

  - 创建一个独立的Python运行环境，并命名为venv：`$ virtualenv --no-site-packages venv`
  - 启动方式：`$ source venv/bin/activate`
  - 退出方式：`$ deactivate`

## `PHP`：开发技巧

- cronjobs以curl方式执行php的时间可能超过30s，导致被web server强制退出。  
  解决办法：在PHP程序的初始代码中，补充设置如下代码

  ``` php
  ignore_user_abort(true); // 设置后台运行，不受前端断开连接影响
  set_time_limit(0); // 脚本运行时间无限制
  ```

## `HTML`：开发技巧

- `<a herf="#" onclick="gotoPage('2')">`标签等组件包含了默认动作，例如herf属性就会触发页面跳转，导致不需要的页面刷新。  
  解决方法：通过控制`return false`的方式阻止默认动作的发生，具体请参见[示范案例](https://www.cnblogs.com/weiwang/archive/2013/08/19/3268374.html)

---

## `Scrapy`：开发技巧

- 调试xpath时，在request成功后中断执行过程打开shell的方法

  ```python
  from scrapy.shell import inspect_response
  inspect_response(response, self)
  ```

- xpath的内置函数`normalize-space`，功能是去掉前后的空格，可以用在属性上，也可以用在结果上，例如：

  ```python
  response.xpath("//div[normalize-space(@class)='nav']/text()")

  response.xpath("normalize-space（//div[normalize-space(@class)='nav']/text()）")
  ```

- 提取html所有文本的粗暴方法

  ```python
  response.xpath("string(.)")
  ```

- 注意：由于scrapy.request的meta传递是浅复制，修复递归调用request时`yield item`可能出现数据混乱的bug，
  解决方法是将spider中item()初始化调整到循环体的内部

---

## `Mongo`：各种疑难杂症

- 调用pymongo连接mongo，提示`ServerSelectionTimeoutError: No servers found yet`错误的解决

  原因分析：MongoClient采用后台启动方式，存在线程不安全的问题，立即使用connect可能尚未成功连接  
  解决方法：等待30秒后连接，或者最简单的方法是MongoClient设置`connect＝False`

  > By default, Flask-PyMongo sets the connect keyword argument to False, to prevent PyMongo from connecting immediately. PyMongo itself is **not fork-safe**, and delaying connection until the app is actually used is necessary to avoid issues. If you wish to change this default behavior, pass connect=True as a keyword argument to PyMongo.
  
  [参考文献](https://www.cnblogs.com/dhcn/p/7121395.html)

- 为Mongo数据库的镜像配置初始化用户和口令的方法

  以[mongo:3.6镜像文件](https://github.com/docker-library/mongo/tree/master/3.6)为例，启动命令是`/usr/local/bin/docker-entrypoint.sh`

  分析该脚本文件可以发现，设置数据库初始化用户是通过在操作系统中设置环境变量`MONGO_INITDB_ROOT_USERNAME`和`MONGO_INITDB_ROOT_PASSWORD`来实现的。  

  mongo shell的格式为: ```mongo -u username -p password --authenticationDatabase admin```

  注意：mongo初始化用户的角色级别为root，需要授权创建和修改database。

- 调用`flask-mongoengine`连接mongo，采用URI方式配置参数一直报各类鉴权错误

  [MongoEngine关于connect的规定](http://docs.mongoengine.org/guide/connecting.html) ：
  >- If the database requires authentication, username, password and authentication_source arguments should be provided.
  >- Database, username and password from URI string overrides corresponding parameters in connect().

    ``` python
    connect(
        db='test',
        username='user',
        password='12345',
        host='mongodb://admin:qwerty@localhost/production'
    )
    ```

  [Flask Mongoengine关于connect的规定](https://mongoengine-odm.readthedocs.io/guide/connecting.html):
  >- Uri style connections are also supported, just supply the uri as the host in the ‘MONGODB_SETTINGS’ dictionary with app.config.
  >- Note that database name from uri has priority over name.

  最终建议：

  1. 在使用Mongoengine方式连接Mongo数据库时，不要采用URI方式，而是单独设置每个参数;
  2. 启用鉴权方式时，必须显式包含username、password、authentication_source。
  
  标准格式如下：

    ``` python
    MONGODB_SETTINGS = {
      'db': 'cmccb2b',
      'username': os.getenv('MONGODB_USERNAME'),
      'password': os.getenv('MONGODB_PASSWORD'),
      'host': os.getenv('MONGODB_HOST'),
      'port': int(os.getenv('MONGODB_PORT')),
      'connect': False,  # set for pymongo bug fix
      'authentication_source': 'admin', # set authentication source database， default is MONGODB_NAME
    }
    ```

  相关示范案例，请参见[Mongo配置鉴权方式的经验](https://www.techcoil.com/blog/how-to-enable-authenticated-mongodb-access-for-flask-mongoengine-applications/)  
