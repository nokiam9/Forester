# 版本记录

## 当前记录 V0.1, 2019/10

- 启动Forester的版本开发，版本号记录在`~/.env`文件中
- Mongo数据库改为鉴权方式，初始化用户名和口令配置在docker-compose的`.env`文件中，容器可以通过环境变量引入

## TODO

- Flask要简化uwsgi，改为gunicron方式
- cronjobs镜像改造为jobservices模式

---

## 开发记录(已归档)

### Bug 101

2018.8.10，网站升级，增加了User-Agent格式和Referer跨站脚本的检测功能，并调整了notice_type
  
### Bug102

2019.5.30，网站升级，Ajax的formdata增加_qt字段，键值隐藏在主HTML中，同时增加了Cookie检测。  
为此增加了pre_parse()步骤，读取主HTML中_qt的内容，并填充到parse()的formdata字典

## Bug 103

2018-08-22，站点再次升级反爬虫策略，将qt隐藏在js脚本，并增加注释语句混淆信息
