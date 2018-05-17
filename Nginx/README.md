# Nginx

标签（空格分隔）： nodejs

[TOC]

---
## 反向代理定义
> Reverse Proxy 方式是指以代理服务器来接受Internet上的链接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给internet上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器
![图解反向代理][1]

## 1.nginx命令行命令
```javascript
start nginx 开启nginx
nginx -s stop       快速关闭Nginx，可能不保存相关信息，并迅速终止web服务。
nginx -s quit       平稳关闭Nginx，保存相关信息，有安排的结束web服务。
nginx -s reload     因改变了Nginx相关配置，需要重新加载配置而重载。
nginx -s reopen     重新打开日志文件。
nginx -c filename   为 Nginx 指定一个配置文件，来代替缺省的。
nginx -t            不运行，而仅仅测试配置文件。nginx 将检查配置文件的语法的正确性，并尝试打开配置文件中所引用到的文件。
nginx -v            显示 nginx 的版本。
nginx -V            显示 nginx 的版本，编译器版本和配置参数。
```
## 2.nginx简单配置文件
---
### 2.1nginx.conf配置项详解
> nginx/conf/nginx.conf 文件是nginx的配置文件
```py
#定义Nginx运行的用户和用户组
user www www;
#nginx进程数，建议设置为等于CPU总核心数。
worker_processes 4;
#全局错误日志定义类型，[ debug | info | notice | warn | error | crit ]
error_log /var/log/nginx/error.log info;
#进程文件
pid /var/run/nginx.pid;
#一个nginx进程打开的最多文件描述符数目，理论值应该是最多打开文件数（系统的值ulimit -n）与nginx进程数相除，但是nginx分配请求并不均匀，所以建议与ulimit -n的值保持一致。
worker_rlimit_nofile 65535;
#工作模式与连接数上限
events {
    #参考事件模型，use [ kqueue | rtsig | epoll | /dev/poll | select | poll ]; epoll模型是Linux 2.6以上版本内核中的高性能网络I/O模型，如果跑在FreeBSD上面，就用kqueue模型。
    use epoll;
    #单个进程最大连接数（最大连接数=连接数*进程数）
    worker_connections 65535;
}
#设定http服务器
http {
    #===========================================================#
    #                   加载外部配置文件                        #
    #===========================================================#
    #文件扩展名与文件类型映射表，可使用include来加载外部sever
    # 如：include     dxh\\cs.conf;
    include mime.types; 
    
    default_type application/octet-stream; #默认文件类型
    #charset utf-8; #默认编码
    server_names_hash_bucket_size 128; #服务器名字的hash表大小
    client_header_buffer_size 32k; #上传文件大小限制
    large_client_header_buffers 4 64k; #设定请求缓
    client_max_body_size 8m; #设定请求缓
    sendfile on; #开启高效文件传输模式，sendfile指令指定nginx是否调用sendfile函数来输出文件，对于普通应用设为 on，如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络I/O处理速度，降低系统的负载。注意：如果图片显示不正常把这个改 成off。
    autoindex on; #开启目录列表访问，合适下载服务器，默认关闭。
    tcp_nopush on; #防止网络阻塞
    tcp_nodelay on; #防止网络阻塞
    keepalive_timeout 120; #长连接超时时间，单位是秒
    #FastCGI相关参数是为了改善网站的性能：减少资源占用，提高访问速度。下面参数看字面意思都能理解。
    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;
    fastcgi_buffer_size 64k;
    fastcgi_buffers 4 64k;
    fastcgi_busy_buffers_size 128k;
    fastcgi_temp_file_write_size 128k;
    #gzip模块设置
    gzip on; #开启gzip压缩输出
    gzip_min_length 1k; #最小压缩文件大小
    gzip_buffers 4 16k; #压缩缓冲区
    gzip_http_version 1.0; #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
    gzip_comp_level 2; #压缩等级
    gzip_types text/plain application/x-javascript text/css application/xml; #压缩类型，默认就已经包含text/html，所以下面就不用再写了，写上去也不会有问题，但是会有一个warn
    gzip_vary on; #limit_zone crawler $binary_remote_addr 10m; #开启限制IP连接数的时候需要使用
    
    #===========================================================#
    #                       负载均衡                            #
    #===========================================================#
    #upstream的负载均衡，weight是权重，可以根据机器配置定义权重。weigth参数表示权值，权值越高被分配到的几率越大。
    upstream localServerName { 
        server 192.168.80.121:80 weight=3;
        server 192.168.80.122:80 weight=2;
        server 192.168.80.123:80 weight=3;
    }
    
    #虚拟主机的配置
    server {
        #监听端口
        listen 80;
        #域名可以有多个，用空格隔开 
        # 当访问  http://www.chenxuanyu.com时，由DNS解析到这本服务器
        # 访问http://www.chenxuanyu.com:80(http默认端口)时，就会将请求转发到 本地开启的服务
        server_name www.chenxuanyu.com www.servernames.com;
        
        index index.html index.htm index.php;# 默认的首页，添加后缀
        root /home/dist; # 默认访问该目录下的index.html文件，作为根文件
        location / {
            try_files     $uri $uri/ @router;
            index         index.html;
        }
        # 子路由重定向
        location @router {
            rewrite ^.*$ /index.html last;
        }
        #图片缓存时间设置
        location ~ .*.(gif|jpg|jpeg|png|bmp|swf)$ {
            expires 10d;
        }
        #JS和CSS缓存时间设置
        location ~ .*.(js|css)?$ {
            expires 1h;
        }
        #===========================================================#
        #                       日志部分                            #
        #===========================================================#
        #定义生成日志格式 在access_log后面加上该access名字，可以以后面的方式生成日志文件
        log_format access '$remote_addr - $remote_user [$time_local] "$request" '
        '$status $body_bytes_sent "$http_referer" '
        '"$http_user_agent" $http_x_forwarded_for';
        
        #定义本虚拟主机的访问日志,access与上面的log_format后面的名字对应，后面是生成日志的路径
        access_log /nginx/log/cxy.log access;
    
        #对 所有 即："/"的请求使用反向代理
        location / {
            proxy_pass http://127.0.0.1:88;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;
            #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            #以下是一些反向代理的配置，可选。
            proxy_set_header Host $host;
            client_max_body_size 10m; #允许客户端请求的最大单文件字节数
            client_body_buffer_size 128k; #缓冲区代理缓冲用户端请求的最大字节数，
            proxy_connect_timeout 90; #nginx跟后端服务器连接超时时间(代理连接超时)
            proxy_send_timeout 90; #后端服务器数据回传时间(代理发送超时)
            proxy_read_timeout 90; #连接成功后，后端服务器响应时间(代理接收超时)
            proxy_buffer_size 4k; #设置代理服务器（nginx）保存用户头信息的缓冲区大小
            proxy_buffers 4 32k; #proxy_buffers缓冲区，网页平均在32k以下的设置
            proxy_busy_buffers_size 64k; #高负荷下缓冲大小（proxy_buffers*2）
            proxy_temp_file_write_size 64k;
            #设定缓存文件夹大小，大于这个值，将从upstream服务器传
        }
        # 访问：http://www.chenxuanyu.com/weChat
        # 会将上面的请求代理到本地localhost:port的服务
        location ^~ /weChat/ {
            proxy_pass  http://localServerName; # 与上面的upstream相对应
        }
        #设定查看Nginx状态的地址
        location /NginxStatus {
            stub_status on;
            access_log on;
            auth_basic "NginxStatus";
            auth_basic_user_file conf/htpasswd;
            #htpasswd文件的内容可以用apache提供的htpasswd工具来产生。
        }
        #本地动静分离反向代理配置
        #所有jsp的页面均交由tomcat或resin处理
        location ~ .(jsp|jspx|do)?$ {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:8080;
        }
        #所有静态文件由nginx直接读取不经过tomcat或resin
        location ~ .*.(htm|html|gif|jpg|jpeg|png|bmp|swf|ioc|rar|zip|txt|flv|mid|doc|ppt|pdf|xls|mp3|wma)$ { 
            expires 15d; 
        }
        location ~ .*.(js|css)?${
            expires 1h; 
        }
    }
}
```
#### 例子：
```py
#运行用户
#user somebody;

#启动进程,通常设置成和cpu的数量相等
worker_processes  1;

#全局错误日志
error_log  D:/Tools/nginx-1.10.1/logs/error.log;

#PID文件，记录当前启动的nginx的进程ID
pid        D:/Tools/nginx-1.10.1/logs/nginx.pid;

#工作模式及连接数上限
events {
    worker_connections 1024;    #单个后台worker process进程的最大并发链接数
}

#设定http服务器，利用它的反向代理功能提供负载均衡支持
http {
    #设定mime类型(邮件支持类型),类型由mime.types文件定义
    include       D:/Tools/nginx-1.10.1/conf/mime.types;
    default_type  application/octet-stream;
    
    #设定日志
    log_format  main  '[$remote_addr] - [$remote_user] [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
                      
    access_log    D:/Tools/nginx-1.10.1/logs/access.log main;
    rewrite_log     on;
    
    #sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件，对于普通应用，
    #必须设为 on,如果用来进行下载等应用磁盘IO重负载应用，可设置为 off，以平衡磁盘与网络I/O处理速度，降低系统的uptime.
    sendfile        on;
    #tcp_nopush     on;

    #连接超时时间
    keepalive_timeout  120;
    tcp_nodelay        on;
    
    #gzip压缩开关
    #gzip  on;
 
    #设定实际的服务器列表 
    upstream zp_server1{
        server 127.0.0.1:8089;
    }

    #HTTP服务器
    server {
        #监听80端口，80端口是知名端口号，用于HTTP协议
        listen       80;
        
        #定义使用www.xx.com访问
        server_name  www.helloworld.com;
        
        #首页
        index index.html
        
        #指向webapp的目录
        root D:\01_Workspace\Project\github\zp\SpringNotes\spring-security\spring-shiro\src\main\webapp;
        
        #编码格式
        charset utf-8;
        
        #代理配置参数
        proxy_connect_timeout 180;
        proxy_send_timeout 180;
        proxy_read_timeout 180;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarder-For $remote_addr;

        #反向代理的路径（和upstream绑定），location 后面设置映射的路径
        location / {
            proxy_pass http://zp_server1;
        } 

        #静态文件，nginx自己处理
        location ~ ^/(images|javascript|js|css|flash|media|static)/ {
            root D:\01_Workspace\Project\github\zp\SpringNotes\spring-security\spring-shiro\src\main\webapp\views;
            #过期30天，静态文件不怎么更新，过期可以设大一点，如果频繁更新，则可以设置得小一点。
            expires 30d;
        }
    
        #设定查看Nginx状态的地址
        location /NginxStatus {
            stub_status           on;
            access_log            on;
            auth_basic            "NginxStatus";
            auth_basic_user_file  conf/htpasswd;
        }
    
        #禁止访问 .htxxx 文件
        location ~ /\.ht {
            deny all;
        }
        
        #错误处理页面（可选择性配置）
        #error_page   404              /404.html;
        #error_page   500 502 503 504  /50x.html;
        #location = /50x.html {
        #    root   html;
        #}
    }
}
```
### 2.2引用的conf文件中常用的包含部分：
> conf/www-chenxuanyu-com-8089.conf 文件包含以下内容
### 2.2.1-upstream 
```python
# 设置开启服务器的时候的域名和端口
# 用node在本地或服务器上开启的服务都是以localhost或127.0.0.1作为域名
# node程序开启的端口:8000
upstream zp_server{ # zp_server是反向代理的名字
    # server 后面是服务器本地开启服务的ip+端口
    server 127.0.0.1:8089;
}
例如：用node开启一个服务，监听本地的8089端口
此时访问这个服务器，那么nginx会将服务代理到这里，从而访问本地的这个服务
```
### 2.2.2-location
```python
server {
	listen 80;
	server_name www.chenxuanyu.com;
	location / {
		proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $http_host;
		proxy_set_header X-Nginx-Proxy true;
		proxy_pass http://cxy;
		proxy_redirect off;
	}
}
```
### 2.2.3-代理原理和流程
> 访问服务器的流程：
1、当www.chenxuanyu.com解析到这个服务器ip的时候，可以通过这个域名映射到这个服务器，也就是通过域名访问这个公网ip+80端口（默认是80端口）
和本地服务是一样的,默认是80端口
2、使用node或者tomcat或者其他apache在本地可以开启这个服务
    使用node时，监听3000端口，那么在上面的upstream中，就写入当前服务监听的端口
3、使用proxy_pass http://cxy 来访问上面定义好的upstream 对应的cxy的sever
![nginx反向代理的原理][2]
    
## 3.使用nginx分流，处理负载均衡
> 高访问量下的nginx需要配置负载均衡
```py
http {
     #设定mime类型,类型由mime.type文件定义
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    #设定日志格式
    access_log    /var/log/nginx/access.log;

    #设定负载均衡的服务器列表
    upstream load_balance_server {
        #weigth参数表示权值，权值越高被分配到的几率越大
        server 192.168.1.11:80   weight=5;
        server 192.168.1.12:80   weight=1;
        server 192.168.1.13:80   weight=6;
    }

   #HTTP服务器
   server {
        #侦听80端口
        listen       80;
        
        #定义使用www.xx.com访问
        server_name  www.helloworld.com;

        #对所有请求进行负载均衡请求
        location / {
            root        /root;                 #定义服务器的默认网站根目录位置
            index       index.html index.htm;  #定义首页索引文件的名称
            proxy_pass  http://load_balance_server ;#请求转向load_balance_server 定义的服务器列表

            #以下是一些反向代理的配置(可选择性配置)
            #proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_connect_timeout 90;          #nginx跟后端服务器连接超时时间(代理连接超时)
            proxy_send_timeout 90;             #后端服务器数据回传时间(代理发送超时)
            proxy_read_timeout 90;             #连接成功后，后端服务器响应时间(代理接收超时)
            proxy_buffer_size 4k;              #设置代理服务器（nginx）保存用户头信息的缓冲区大小
            proxy_buffers 4 32k;               #proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
            proxy_busy_buffers_size 64k;       #高负荷下缓冲大小（proxy_buffers*2）
            proxy_temp_file_write_size 64k;    #设定缓存文件夹大小，大于这个值，将从upstream服务器传
            
            client_max_body_size 10m;          #允许客户端请求的最大单文件字节数
            client_body_buffer_size 128k;      #缓冲区代理缓冲用户端请求的最大字节数
        }
    }
}
```
![nginx处理负载均衡][3]
## 4.nginx处理网站多web的配置
> 当一个网站功能越来越丰富时，往往需要将一些功能相对独立的模块剥离出来，独立维护。这样的话，通常，会有多个 webapp。

----------

>举个例子：假如 www.helloworld.com 站点有好几个webapp，finance（金融）、product（产品）、admin（用户中心）。访问这些应用的方式通过上下文(context)来进行区分:
>>www.helloworld.com/finance/
www.helloworld.com/product/
www.helloworld.com/admin/

- [x] http的默认端口号是80，如果在一台服务器上同时启动这3个 webapp 应用，都用80端口，肯定是不成的。所以，这三个应用需要分别绑定不同的端口号。
```python
http {
    upstream product_server{
        server www.helloworld.com:8081;
    }
    upstream admin_server{
        server www.helloworld.com:8082;
    }
    upstream finance_server{
        server www.helloworld.com:8083;
    }
    server {
        #此处省略一些基本配置
        #默认指向product的server
        location / {
            proxy_pass http://product_server;
        }
        location /product/{
            proxy_pass http://product_server;
        }
        location /admin/ {
            proxy_pass http://admin_server;
        }
        location /finance/ {
            proxy_pass http://finance_server;
        }
    }
}
```
## *nginx代理注意事项
1.如果是代理到本地的服务，那么在使用nginx的时候，server_name就是localhost
![本地nginx代理的原理][4]

### 前端静态资源处理子路由的目录
> 当页面中有子路由的时候，需要配置一下的配置
```javascript
    location / {
        try_files     $uri $uri/ @router;
        index         index.html;
    }
    location @router {
        //尝试以路径匹配页面，而不是接口
        rewrite ^.*$ /index.html last;
    }
```

### 实例qnmd代理
```
upstream qnmd{
    server       127.0.0.1:8381 weight=1;
}
server {
    listen       80;
    server_name  qnmd.sagacloud.cn;
    access_log   logs/qnmd.access.log  main;

    root         /apps/qnmd/dist;
    index        index.html;

    location / {
        try_files     $uri $uri/ @router;
        index         index.html;
    }
    location @router {
        rewrite ^.*$ /index.html last;
    }

    location ^~ /weChat/ {
        proxy_pass              http://qnmd;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size    20m;
        client_body_buffer_size 128k;
        proxy_buffers           32 4k;
        proxy_connect_timeout   3;
        proxy_send_timeout      30;
        proxy_read_timeout      30;
    }
    // 转发微信的请求
    location = /sns/oauth2/access_token {
        proxy_pass              https://api.weixin.qq.com/sns/oauth2/access_token;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size    20m;
        client_body_buffer_size 128k;
        proxy_buffers           32 4k;
        proxy_connect_timeout   3;
        proxy_send_timeout      30;
        proxy_read_timeout      30;
    }
    // 微信提供的接口
    location = /cgi-bin/user/info {
        proxy_pass              https://api.weixin.qq.com/cgi-bin/user/info;
        proxy_set_header        Host            $host;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size    20m;
        client_body_buffer_size 128k;
        proxy_buffers           32 4k;
        proxy_connect_timeout   3;
        proxy_send_timeout      30;
        proxy_read_timeout      30;
    }
}
```




  [1]: http://osjykr1v3.bkt.clouddn.com/FiFfyQkkCb0yPUcTPqMhCb64f6nk
  [2]: http://osjykr1v3.bkt.clouddn.com/Fj3XSzfhzmId2vqgFY_K3L1QlXj-
  [3]: http://osjykr1v3.bkt.clouddn.com/FsCaEMcy1Sqz0sbHIDs1QX-H63xI
  [4]: http://osjykr1v3.bkt.clouddn.com/Fjq4agGHIGPPVARUpqr0Rhm9QR_U