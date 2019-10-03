# 一些有用的开发技巧

## 1、为Mongo数据库的镜像配置初始化用户和口令的方法

以[mongo:3.6镜像文件](https://github.com/docker-library/mongo/tree/master/3.6)为例，启动命令是`/usr/local/bin/docker-entrypoint.sh`

分析该脚本文件可以发现，设置数据库初始化用户是通过在操作系统中设置环境变量`MONGO_INITDB_ROOT_USERNAME`和`MONGO_INITDB_ROOT_PASSWORD`来实现的。  

> 注意：mongo初始化用户的角色级别为root，需要授权创建和修改database


> mongo shell的格式为: `mongo -u username -p password --authenticationDatabase admin`

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

- Scrapy: 修复递归调用request时item数据混乱的bug，解决方法是将spider中item()初始化调整到循环体的内部，因为scrapy.request的meta传递是浅复制
  