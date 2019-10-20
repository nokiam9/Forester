# Container Xunsearch for Forester

## 功能概述

- Mongo数据库自带搜索功能，但不支持中文分词，为此独立部署了迅搜服务
- Xunserch是一个中文搜索引擎，包含了前台、后台两个服务镜像，前台仅支持PHP语言

## 目录结构

``` txt
xunsearch  
├── xunsearch-server.dockerfile                 // 迅搜后台服务镜像的构造文件  
├── xunsearch.dockerfile                        // 迅搜前台PHP服务镜像的构造文件  
├── cmccb2b.ini                                 // 迅搜服务的配置文件，前后台均需要  
├── entrypoint.sh                               // 迅搜前台服务镜像的启动进程，就是启动Apache（0.3废弃）  
├── app  
│   ├── css                                     // 迅搜提供的样式文件目录  
│   ├── img                                     // 迅搜提供的图标文件目录  
│   ├── search.php                              // 搜索前台UI主页面的PHP前台程序，Usage：`0.0.0.0:9000/search.php`  
│   ├── search.tpl                              // 搜索前台UI主页面的HTML模版，tpl格式  
│   ├── suggest.php                             // 提供搜索建议的嵌套小页面  
│   ├── util                                    // 几个系统检测的小工具  
│   │   ├── mongo_connect.php  
│   │   ├── mongo_query_last5minutes.php        // 提取5分钟前的数据库新纪录的小工具  
│   │   └── phpinfo.php  
│   ├── xs_clean_update_log.php                 // 用于清除索引文件断点日志的小工具，执行后下面的php就可以全量重建索引文件  
│   └── xs_update_index.php                     // 刷新索引文件的PHP后台程序（增量方式，先检查断点日志纪录），由JobService定时调度  
└── README.md                                   // 本文件  
```

## 注意事项

- 每个php脚本在开发时，都需要包含xunsearch定义的lib文件：`require_once '/usr/local/xunsearch/sdk/php/lib/XS.php';`

## 参考文档

- [xunsearch的下载地址](http://www.xunsearch.com/site/download)  
- [xunsearch的参考文档](http://www.xunsearch.com/doc/php/guide/start.overview)
  
---

## 附录一：关于Xunsearch Server镜像

后台服务的基础镜像来自于`hightman/xunsearch`，添加配置文件`cmccb2b.ini`即完成了构造。 
应用软件的安装点是`/usr/local/xunsearch`，目录结构为： 

- `bin/`:后台服务的核心程序，包括`searchd`、`indexer`等
- `data/`：索引文件的数据目录，将被mount到外部Volume
- `etc/`：后台服务的配置文件，也包含自定义词典，但不含project文件
- `include/`：后台服务是C++写的，这里是头文件
- `lib/`：后台服务是C++写的，这里是库文件
- `sdk/`：这也是PHP SDK的安装点，project配置文件也在这里
- `share/`:还不清楚
- `tmp/`:临时文件，存放pid和log等运行信息

## 附录二：关于Xunsearch Server镜像

因为需要安装PHP的Mongo插件，前台服务不能直接使用Xunsearch提供的镜像，只能自己开发了构造文件。  
主要包括：PHP基础软件包、PHP的Mongo插件、Apache服务器、迅搜SDK包、自定义的应用软件和配置文件。  
xunsearch PHP SDK的安装点位于`/usr/local/xunsearch/sdk/php`，目录结构为：

- `app/`: 存放核心的项目配置文件`cmccb2b.ini`和`demo.ini`
- `lib/`: php lib库文件
- `util/`: 一些实用脚本程序
- `doc/`: 文档资料
