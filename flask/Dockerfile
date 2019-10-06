#FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine:3.7
FROM python:3.6
LABEL MAINTAINER="sj0225@icloud.com"

# 安装基础依赖软件
RUN mkdir -p /var/log/supervisor
RUN pip install supervisor gunicorn -i https://mirrors.aliyun.com/pypi/simple/
COPY supervisored.conf /etc/supervisored.conf

COPY ./requirements.txt /
RUN pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# 传入APP文件，注意：src不含／，必须整个目录拷贝
COPY ./app /app

WORKDIR /app

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/supervisord"]