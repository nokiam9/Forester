# Forester项目的生产环境部署

## 1、安装并启动Nginx服务

## 2、安装并配置amce加密证书

## 3、下载项目代码，启动容器应用服务

## 4、配置Nginx，并反向代理到容器应用服务

---

## 附录： Nginx的参考配置文件

### 1、应用配置文件：`/etc/nginx/conf.d/www.caogo.cn.conf`

``` txt
# 将 https://www.caogo.cn, https://scrapy.caogo.cn, https://xunsearch.caogo.cn 反向代理到docker
server {
    listen 443 ssl;
    server_name www.caogo.cn scrapy.caogo.cn xunsearch.caogo.cn;

    ssl on;
    location / {
        proxy_pass http://localhost:8080;  # Update container 8080:80 in docker-compose.yml

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_buffering off;
        proxy_request_buffering off;
    }
}

# 将 https://caogo.cn 重定向到 https://www.caogo.cn
server {
    listen 443 ssl;
    server_name caogo.cn;

    return 301 https://www.caogo.cn$request_uri;
}
```

### 2、站点配置文件：`/etc/nginx/conf.d/default.conf`

``` txt
# 将caogo.cn的二级域名和全部三级域名，从http重定向到https
server {
  listen 80;
  server_name caogo.cn *.caogo.cn;

  location / {
    rewrite ^(.*)$  https://$host$1 permanent;
  }
}

# 80端口的默认服务，如果server_name未在其他配置文件中设置，返回403错误码
server {
  listen 80 default_server;
  server_name _;
  
  return 403;
}

# 443端口的默认服务，如果server_name未在其他配置文件中设置，返回444未定义错误码，并终止连接
server {
  listen 443 ssl default_server;
  server_name _;

  return 444;
}
```

### 3、Nginx基础配置文件：`/etc/nginx/nginx.conf`

``` txt
user nginx;
worker_processes auto;

error_log /var/log/nginx/error.log;

events {
  worker_connections 1024;
  use epoll;
  multi_accept on;
}

http {
  tcp_nodelay on;
  tcp_nopush on;
  keepalive_timeout 65;

  sendfile on;
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  # set CA files here
  ssl_certificate     /etc/nginx/ssl/fullchain.cer;
  ssl_certificate_key /etc/nginx/ssl/caogo.cn.key;
  # ssl_trusted_certificate /etc/nginx/ssl/caogo.cn.cer;

  # SSL gloable settings
  ssl_protocols TLSv1.1 TLSv1.2;
  ssl_ciphers '!aNULL:kECDH+AESGCM:ECDH+AESGCM:RSA+AESGCM:kECDH+AES:ECDH+AES:RSA+AES:';
  ssl_prefer_server_ciphers on;
  ssl_session_cache shared:SSL:10m;

  # this is necessary for us to be able to disable request buffering in all cases
  proxy_http_version 1.1;

  access_log /var/log/nginx/access.log;

  # ENTRYPOINT OF USER-DEFINED CONFIG
  include /etc/nginx/conf.d/*.conf;
}
```
