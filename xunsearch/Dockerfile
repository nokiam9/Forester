#  该基础镜像包括php7.2.23+apache2.48，Entrypoint自启动apache
FROM php:7.2-apache

# 安装必要的工具
RUN apt-get update && \
    apt-get install -y wget unzip netcat

# 安装mongodb的PHP扩展，注意apt-get安装openssl以支持mongo鉴权登录方式
RUN apt-get install -y libcurl4-openssl-dev libssl-dev && \
    pecl install mongodb && \
    docker-php-ext-enable mongodb

# Apache2配置文件：/etc/apache2/apache2.conf，设置一个默认服务名，避免启动时给个提示让人紧张
RUN echo "Servername localhost" >> /etc/apache2/apache2.conf

# 安装xunsearch的PHP SDK组件到/app，并将项目文件放入sdk/php/app/目录
WORKDIR /
RUN wget "http://www.xunsearch.com/download/xunsearch-sdk-latest.zip"  && \
    unzip xunsearch-sdk-latest.zip -d /app && \
    rm xunsearch-sdk-latest.zip
COPY cmccb2b.ini /app/xunsearch-sdk/php/app/

# 用完包管理器后安排打扫卫生可以显著的减少镜像大小, release发布时启用
RUN apt-get clean && \
    apt-get autoclean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# PHP应用文件放入/App目录，并软连接到apache的HTML根目录/var/www/html
RUN mkdir -p /app && rm -rf /var/www/html && ln -s /app /var/www/html
COPY app/ /app