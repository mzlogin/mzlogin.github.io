---
layout: post
title: Python 核心编程中文第二版课后练习 3.8 答案
categories: Python
description: 自学 Python 核心编程过程中对课后习题的答案记录。
keywords: Python
---

3-1 变量在第一次被赋值时自动声明。在赋值时解释器会根据语法和右侧的操作数来决定新对象的类型。

3-2 函数总是返回一个值，显式 return 的值或者 None。返回的值的类型也是动态确定。

3-3 因为变量名 __xxx__ 对 Python 来说有特殊含义，对于普通的变量应当避免这种命名风格。

3-4 可以，使用 ";"

3-5 可以，使用 "\" 或者括号

3-6

(a)x = 1, y = 2, z = 3

(b)z = 2, x = 3, y = 1

3-7 40XL, $aving$, 0x40L, thisIsn'tAVar, big-daddy, 2hot2touch, counter-1 不合法。不是以字母或者下划线开头，或者有非字母下划线数字的字符。print, if 是关键字。

3-10

用异常处理取代对 os.path.exists() 的调用：

```python
import os

ls = os.linesep

while True:
    fname = raw_input('input a filename:')
#    if os.path.exists(fname):
#        print "Error: '%s' already exists" % fname
#    else:
#        break
    try:
        fobj = open(fname, 'r')
    except IOError, e:
        break;
    else:
        print "Error: '%s' already exists" % fname
        fobj.close()

all = []
print "\nEnter lines ('.' by itself to quit).\n"

while True:
    entry = raw_input('>')
    if entry == '.':
        break
    else:
        all.append(entry)

fobj = open(fname, 'w')
fobj.writelines(['%s%s' % (x, ls) for x in all])
fobj.close()
print 'Done!'
```

用 os.path.exists() 取代异常处理方法：

```python
import os

fname = raw_input('Enter filename:')
print

#try:
#    fobj = open(fname, 'r')
#except IOError, e:
#    print '*** file open error:', e
#else:
#    for eachLine in fobj:
#        print eachLine,
#    fobj.close()
if os.path.exists(fname):
    fobj = open(fname, 'r')
    for eachLine in fobj:
        print eachLine,
    fobj.close()
else:
    print 'this file not exists'
```

3-11

```python
import os

fname = raw_input('Enter filename:')
print

#try:
#    fobj = open(fname, 'r')
#except IOError, e:
#    print '*** file open error:', e
#else:
#    for eachLine in fobj:
#        print eachLine,
#    fobj.close()
if os.path.exists(fname):
    fobj = open(fname, 'r')
    for eachLine in fobj:
        print eachLine.strip()
    fobj.close()
else:
    print 'this file not exists'
```

3-12

```python
"""to read or make a file"""
import os

def makeTextFile():
    '''make a file'''
    ls = os.linesep
    while True:
        fname = raw_input('input a filename:')
    #    if os.path.exists(fname):
    #        print "Error: '%s' already exists" % fname
    #    else:
    #        break
        try:
            fobj = open(fname, 'r')
        except IOError, e:
            break;
        else:
            print "Error: '%s' already exists" % fname
            fobj.close()

    all = []
    print "\nEnter lines ('.' by itself to quit).\n"

    while True:
        entry = raw_input('>')
        if entry == '.':
            break
        else:
            all.append(entry)

    fobj = open(fname, 'w')
    fobj.writelines(['%s%s' % (x, ls) for x in all])
    fobj.close()
    print 'Done!'

def readTextFile():
    '''read a file'''
    fname = raw_input('Enter filename:')
    print

    #try:
    #    fobj = open(fname, 'r')
    #except IOError, e:
    #    print '*** file open error:', e
    #else:
    #    for eachLine in fobj:
    #        print eachLine,
    #    fobj.close()
    if os.path.exists(fname):
        fobj = open(fname, 'r')
        for eachLine in fobj:
            print eachLine.strip()
        fobj.close()
    else:
        print 'this file not exists'

def main():
    '''main menu'''
    while True:
        print '1.Read a file'
        print '2.Make a file'
        print 'x.exit'
        myStr = raw_input('input your choice:')
        if myStr == '1':
            readTextFile()
        elif myStr == '2':
            makeTextFile()
        elif myStr == 'x':
            break

if __name__ == '__main__':
    main()
```

3-13

Windows 下 curses 模块貌似无法正常使用……

迂回的实现思路是将文件内容按行读取到一个列表里，

然后让用户修改每一行，

最后让用户选择是否保存，

保存则重写文件，

不保存则退出。
