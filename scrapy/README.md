# Container Scrapy for Forester

## 功能概述

- 基于scrapy，为b2b.10086.cn构造了spider:bid_notice，并将数据通过pipeline导入mongo db；
- 安装了scrapyd，基于6800端口提供scrapy的调度服务

## 目录结构

``` bash
├── Dockerfile                          // 镜像构造文件v
├── README.md                           // 本文件
├── app                                 // 用户程序文件目录
│   ├── cmccb2b                         // scrapy应用目录
│   │   ├── __init__.py
│   │   ├── items.py                    // 字段定义文件
│   │   ├── middlewares.py              // 中间件标准插件，系统默认无修改
│   │   ├── pipelines                   // 管道自定义文件
│   │   │   ├── __init__.py
│   │   │   ├── attachment.py           // 自定义插件，用于附件的下载
│   │   │   └── pymongo.py              // 自定义插件，用于mongo数据存储
│   │   ├── settings.py                 // scrapy的用户配置
│   │   ├── spiders                     // spider应用目录
│   │   │   ├── __init__.py
│   │   │   ├── bid_notice.py           // b2b.10086.cn的spider
│   │   │   ├── gsgov_procurement.py    // www.gszfcg.gansu.gov.cn的spider
│   │   └── utils                       // 自定义工具函数的package
│   │       ├── __init__.py
│   │       ├── date_encoder.py         // 为json.dump提供datetime的数据类型转换
│   │       ├── html2text.py            // 提取html标签中的文本
│   ├── run.py                          // 用于手工启动scrapy的shell
│   └── scrapy.cfg                      // scrapy的项目配置
├── requirements.txt                    // 构造image需要的python依赖库，例如scrapy、scrapyd、pymongo等
└── scrapyd.conf                        // scrapyd的配置文件
```

## 启动方式

- 从docker-compose中自动启动，实际是`Dockerfile`中定义的`ENTRYPOINT ["/usr/local/bin/scrapyd"]`
- scrapyd进入守护教程，等待cronjobs通过`curl http://forester-scrapy:6800`的远程json调用
- `http://forester-scrapy:6800`还可以提供web方式的监控界面

## 注意事项

- **目前自定义pipeline插件pymongo还有无法解决的bug**。由于scrapy仅支持NotConfigure异常，不支持自定义的异常，在open_spider时如果发现mongo连接失败，或create index失败时，因为spider尚未打开，也无法close_spider, pipelines直接就被放弃导致抓取数据完成后无法退出，只能采用raise未定义exception的方式，直接转入deffer异常退出
- 目前`settings.py`设置不启用attachment的pipeline，因为下载文件的数量太大
- 由于mongo不支持timezone，导致order by时无法按本地时间排序的问题，解决方法是timestamp实际存储的是“错误的UTC时间”，即"UTC时间+8hours时差"
- 修复递归调用request时item数据混乱的bug，解决方法是将spider中item()初始化调整到循环体的内部，因为scrapy.request的meta传递是浅复制

---

## TODO

- 需要设置`/app/logs`，
- 研究log的level设置，解决日志信息过多的问题