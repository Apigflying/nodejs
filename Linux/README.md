# Linux命令行

标签（空格分隔）： Linux

[TOC]

---

## 前言
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
#### 2.1 ls 显示当前目录的内容
[选项]：
    -a  显示所有文件，包括隐藏文件
    -l  显示详细信息
    -d  查看目录属性
    -h  人性化显示文件大小
    -i  显示inode（系统在生成，操作，显示，查看文件的时候，文件系统会为每个文件分配一个id，-i就可以显示这个文件的id号）

[参数]：
    目录名

使用ls -l /etc/ 查看文件详细信息
返回数据第一列解读：
    首字母|符号代表文件类型
    `-` 表示文件
    `d` 目录
    `l` 软链接文件（快捷方式）

    

`>`在linux中是重定向的意思。把前面产生的输出 写入到后面的文件中，如果文件中有内容，那么就替换掉
`cat [文件名]`显示这个文件的代码
`>>` 追加。不删除，只追加


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

#### mv移动、重命名
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













