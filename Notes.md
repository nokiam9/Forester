# 一些有用的开发技巧

## 1、为Mongo数据库的镜像配置初始化用户和口令的方法

以[mongo:3.6镜像文件](https://github.com/docker-library/mongo/tree/master/3.6)为例，启动命令是`/usr/local/bin/docker-entrypoint.sh`

分析该脚本文件可以发现，设置数据库初始化用户是通过在操作系统中设置环境变量`MONGO_INITDB_ROOT_USERNAME`和`MONGO_INITDB_ROOT_PASSWORD`来实现的。  

mongo shell的格式为: ```mongo -u username -p password --authenticationDatabase admin```

注意：mongo初始化用户的角色级别为root，需要授权创建和修改database。

### 问题1: 调用pymongo连接mongo，提示“ServerSelectionTimeoutError: No servers found yet”错误的解决

- 原因分析：MongoClient采用后台启动方式，立即使用connect可能尚未成功连接，解决方法是等待30秒后连接，或者最简单的方法是MongoClient设置`connect＝False`
  
- [[参考文献]](https://www.cnblogs.com/dhcn/p/7121395.html)
  
### 问题2: 调用flask-mongoengine连接mongo，运行时一直报鉴权错误

- 原因分析：flask-mongoengine默认的鉴权数据库是`MONGODB_SETTINGS.db`，需要在MONGODB_SETTINGS的参数设置中强制定义为`admin`

- [参考文献](https://www.techcoil.com/blog/how-to-enable-authenticated-mongodb-access-for-flask-mongoengine-applications/)

---

## 2、如何在docker-compose中设置操作系统的环境变量

在docker-compose的配置文件目录，编辑默认环境文件`.env`，并在该文件中定义需要的变量。
> 注意：这些变量只能在`docker-compose.yml`中被引用

``` txt
__VERSION__=1.0

F6R_MONGO_USERNAME=root
F6R_MONGO_PASSWORD=forester
```

然后在`docker-compose.yml`中就可以导入`.env`文件中定义的环境变量

``` yml
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${F6R_MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${F6R_MONGO_PASSWORD}
```

---

## 3、几个bug修复

- Scrapy: 修复递归调用request时item数据混乱的bug，解决方法是将spider中item()初始化调整到循环体的内部，因为scrapy.request的meta传递是浅复制
- 增加查询专用index，解决pagination内存溢出问题
- `<a herf="#" onclick="gotoPage('2')">`标签等组件包含了默认动作，例如herf属性就会触发页面跳转，导致不需要的页面刷新，
可以通过控制return false的方式阻止默认动作的发生，具体参见[文档](https://www.cnblogs.com/weiwang/archive/2013/08/19/3268374.html) 
- 基于python3.6成功安装pyecharts，但alpine3.7报错很多
- 建立venv/的virtualenv，启动方式为`$ source venv/bin/activate`，退出方式为`$ deactivate`

## scrapy的spider打开shell用于调试xpath的方法

```python
from scrapy.shell import inspect_response
inspect_response(response, self)
```

---

## xpath函数normalize-space()的功能是去掉前后的空格，有两种用法：

第一种方法非常实用,normalize-space用在属性上，如  

```python
response.xpath("//div[normalize-space(@class)='nav']/text()")
```

第二种方法：normalize-space用结果上，如  

```python
response.xpath("normalize-space（//div[normalize-space(@class)='nav']/text()）")
```

---

## 提取html所有文本的最简单方法

```python
response.xpath("string(.)")
```