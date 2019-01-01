# 版本记录

## 当前记录 2018/01

- 在`docker-compose.yml`中设置mongo的初始化用户和密码，mongo shell的格式为: `mongo -u username -p password --authenticationDatabase admin`
>> mongo初始化用户的角色级别为root，需要授权创建和修改database；

- 构造scrapy，修改`settings.py`的mongo-uri配置，运行成功，后续要简化uwsgi，改为gunicron

## TODO

- [] 创建新版本
- [] Continued...