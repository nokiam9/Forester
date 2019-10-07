FROM python:3.6-slim
LABEL MAINTAINER="sj0225@icloud.com"

# 安装基础依赖软件
COPY ./requirements.txt /
RUN pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# 传入APP文件，注意：src不含／，必须整个目录拷贝
COPY ./supervisord.conf /etc/supervisord.conf
COPY ./app /app

WORKDIR /app

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/supervisord"]