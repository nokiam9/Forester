FROM python:3.6-slim
LABEL MAINTAINER="sj0225@icloud.com"

# 安装基础依赖软件
RUN apt-get update && apt-get install -y netcat

COPY ./requirements.txt /
RUN pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# 传入APP文件，注意：src不含／，必须整个目录拷贝
COPY ./supervisord.conf /etc/supervisord.conf
COPY ./app /app

WORKDIR /app

EXPOSE 8000

CMD ["/usr/local/bin/supervisord"]