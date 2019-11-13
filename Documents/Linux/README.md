﻿# Linux命令行

标签（空格分隔）： Linux

[TOC]

---

### 1. linux 和 windows的不同
Linux严格区分大小写
Linux所有内容以文件的形式保存，包括硬件、用户

在Linux下
`~`表示家目录
root管理员 登录之后所在的家目录通常是：/root
user 用户 登录之后所在的默认家目录是：/home/username/
而在mac下
用户的家目录通常是 /Users/username
### 2.常用命令
> 命令格式：
    命令 [选项] [参数] 
    
    选项可以写在一起 -a -l 可以写成 -al
    -a 等于 --all

#### 2.1 pwd显示当前位置所在的目录
#### 2.2 ls 显示当前目录的内容
[选项]：
    -a  显示所有文件，包括隐藏文件
    -l  显示详细信息
    -d  查看目录属性
    -h  人性化显示文件大小
    -i  显示inode也叫i节点（系统在生成，操作，显示，查看文件的时候，文件系统会为每个文件分配一个id，-i就可以显示这个文件的id号）

[参数]：
    目录名

使用ls -l /etc/ 查看文件详细信息
返回数据第一列解读：
    首字母|符号代表文件类型
    `-` 表示文件
    `d` 目录
    `l` 软链接文件（快捷方式）
    
    
    
#### 2.3 cd 切换目录
[快捷参数]
    `cd ~`  家目录 同`cd`
    `-`     上一次进入的目录
    `..`    返回上一层目录
    `.`         

#### 2.4 ln -s 软链接
`ln [参数] [被链接文件] [生成新文件]`
链接分为两种：
    1.硬链接 不加参数生成的是硬链接。硬链接特点：与源文件具有相同的i节点，文件之间内容互相影响，但是不响应删除操作
    2.软链接 -s 生成软链接。软链接与windows系统中快捷方式等同

```js
// 进入root文件夹下
ln -s /root/abc /tmp/ 
上面的命令会在tmp文件夹内创建/root/abc的快捷方式

ln -s abcd /tmp/
上面的命令执行之后，进入tmp下，会报错，找不到文件。如果被链接文件不加绝对路径，那么会在生成新文件的目录中查找该源文件，进行链接
即：
    在不加绝对路径的情况下，只能链接当前目中的文件的软链接

```
**注：在对一个文件进行软链接的时候，被链接文件要写它的绝对路径（即使文件在当前目录下也要加）**

#### 2.5 chmod 更改文件权限
> `chmod [可选项] <mode> <file...>`

数字权限
> `chmod <abc> file...`

+ 其中a,b,c各为一个数字，分别代表User、Group、及Other的权限。
相当于简化版的chmod u=权限,g=权限,o=权限 file...
而此处的权限将用8进制的数字来表示User、Group、及Other的读、写、执行权限

> chmod 777 file 设置所有人可以读写及执行
  chmod 600 file 设置拥有者可读写，其他人不可读写执行


### 3. 根目录下的文件夹
|目录|说明|
|:--:|:--:|
|bin&usr/bin|保存系统命令如：cd pwd mv rm等&保存用户可执行的系统命令|
|sbin&user/sbin|保存系统命令，保存只有超级用户才有权限调用的命令&保存超级权限用户可以执行的系统命令|
|boot|保存启动数据|
|etc|配置文件目录|
|home|普通用户的家目录|
|root|超级用户的家目录|
|lib|函数库目录（工具函数库），用的时候调用|
|mnt|空目录，用来创建外接设备如：U盘，光盘等|
|proc&sys|保存内存的过载点（不能直接操作）,他俩中的数据直接写在内存中|
|tmp|临时文件目录|
|usr/bin&sbin|系统软件资源保存目录/普通用户&超级用户|
|var|系统可变文档的目录|


### 4.搜索文件
#### 4.1 文件搜索命令locate
特点：搜索速度非常快
格式：locate [文件名] 依根目录为基准，查找所有文件，会找出当前磁盘内，所有包含该文件名的文件
问题：不能查找今天新建的文件，locate搜索后台数据库mlocate，但是通常mlocate一天更新一次。需要使用updatedb手动更新数据库。只能按文件名搜索

updatedb手动更新数据库

#### 4.2 find命令搜索文件
find [搜索范围] [搜索条件]

find [文件] -exec rm -rf {} \
**-exec 对前面搜索到的结果，执行后面的操作**

#### 4.3 搜索字符串 grep
格式：grep [选项] 字符串 文件名
搜索在文件中符合匹配条件的字符串
选项：
    -i 忽略大小写
    -v 排除指定字符串

#### 4.4 赋予文件执行权限
`chmod 755 hello.sh` 赋予文件执行权限
./hello.sh  执行文件





## 1. 文件与目录管理
### 1.1 路径
>**绝对路径**:路径的写法由'/'开头，如：/user/local/mysql，默认从根目录查找

>**相对路径**:路径不是由'/'开头的，从当前目录进行查找

- / 根目录
- ./ 当前目录
- ../ 上级目录
- pwd 当前所在目录的绝对路径 /home/weChat


### 1.2 文件
#### 创建文件夹
`mkdir -[mp] [目录名称]`
[`-p`] 是创建文件夹时的可选参数
+ home下没有testmkdir这个目录
`mkdir /home/testmkdir/abc` -> 无法创建，并且报错
`mkdir -p /home/testmkdir/abc` -> 可以创建testmkdir,并且在这个文件夹里面创建abc目录

#### 删除文件
`rm -[fir] [文件名称]`
[`-f`] -> 强制删除,如果删除不存在的目录或文件，会报错，加上`-f`就不会报错了
[`-i`] -> 当用户删除一个问件时，是否提示真的删除，输入y就是删除，输入n就取消删除
[`-r`] -> 当删除目录时，要加`-r`，否则会报错
```
rm -rf 删除文件也可以删除文件夹
```
**注：rm -rf / 删除所有文件**

#### cp拷贝
`cp [-rdi] [来源文件] [目的文件]`
`-d` - 加上-d复制的是快捷方式，而不是重新复制一份文件
`-r` - 拷贝目录，必须加上-r。否则拷贝不了目录
`-i` - 当遇到一个已经存在的文件时，会询问是否覆盖
**`cp -a`完全拷贝当前文件，包括文件创建时间，相信信息等内容**

#### mv剪切、重命名
`mv [源文件] [目标文件]`
    - 源文件和目标文件不在同一目录下，那么是剪切操作
    - 源文件和目标文件在同一目录下，那么是重命名操作

### 1.3 环境变量
使用which来看这个命令的绝对路径，即，使用这个命令的时候，命令所在的文件夹
这个文件夹的路径会被放入到环境变量PATH中




2.vim的使用
---

## 3.查看进程，关闭进程
### 3.1查看进程
`netstat -anp|more`
查看当前服务器的所有进程
|Proto|Recv-Q|Send-Q|Local Address|Foreign Address|State|PID/Program name|
|:--:|:--:|:--:|
|tcp|0|0|0.0.0.0:27017|0.0.0.0:*|LISTEN|13876/mongod|    
|tcp|0|0|0.0.0.0:80|0.0.0.0:*|LISTEN|17729/nginx|
### 3.2kill进程
根据上面的进程PID可以kill进程`kill -9 13876`关闭mongod进程


## 4.快捷键
`ctrl + l` 清屏相当于clear

## 5.mac 下的命令行工具

### 5.1.登录远程服务器的问题
ssh -p 端口 用户@ip
Permission denied (publickey)
>将/etc/ssh/sshd_config 文件中的
PasswordAuthentication no 改为
PasswordAuthentication yes
然后/etc/init.d/ssh restart重启ssh服务，即可登录

**注：是重启ssh,不是sshd**

### 2.配置mac全局的环境变量
>Mac系统的环境变量，加载顺序为：

- [ ] /etc/profile 
- [ ] /etc/paths 
- [ ] ~/.bash_profile 
- [ ] ~/.bash_login 
- [ ] ~/.profile 
- [x] ~/.bashrc
>当然/etc/profile和/etc/paths是系统级别的，系统启动就会加载，后面几个是当前用户级的环境变量。后面3个按照从前往后的顺序读取，如果~/.bash_profile文件存在，则后面的几个文件就会被忽略不读了，如果~/.bash_profile文件不存在，才会以此类推读取后面的文件。
**~/.bashrc没有上述规则，它是bash shell打开的时候载入的。**
配置mac的环境快捷命令行：
```
alias ll='ls -lG'
alias ls='ls -G'
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
```
>配置之后，还需在.bash_profile文件中加入
```
>sudo vi ~/.bash_profile
//在文件后面加上 ↓
if [ -f ~/.bashrc ]; then
   source ~/.bashrc
fi
```
*配置之后，使用source ~/.bashrc重启*





`>`在linux中是重定向的意思。把前面产生的输出 写入到后面的文件中，如果文件中有内容，那么就替换掉
`cat [文件名]`显示这个文件的代码
`>>` 追加。不删除，只追加








