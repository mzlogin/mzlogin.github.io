---
layout: post
title: Python核心编程中文第二版课后练习2.21答案
categories: Python
---

2-2  
(a)计算1 + 2 * 4  
(b)无输出  
(c)一样。无输出语句。  
(d)单独执行无输出，在交互解释器里执行输出结果。  
(e)print 1 + 2 * 4  
  
2-4  
(a)  
    str = raw_input('input a str:')
    print str

(b)  
    str = raw_input('input a int:')
    print int(str)

2-5  
(a)  
    i = 0
    while i <= 10:
        print i,
        i += 1

(b)  
    for eachNum in range(11):
        print eachNum,

2-6  
    num = raw_input('input a num: ')
    if num > 0:
        print '正数',
    elif num < 0:
        print '负数',
    else:
        print '0',

2-7  
    myStr = raw_input('input a str: ')
    i = 0
    while i < len(myStr):
        print myStr[i],
        i += 1

    myStr = raw_input('input a str: ')
    for c in myStr:
        print c,

2-8  
    aList = list()
    for i in range(5):
        num = raw_input('input a num : ')
        aList.append(int(num))

    i = 0
    myNum = 0
    while i < len(aList):
        myNum += aList[i]
        i += 1

    print 'myNum is : %d' % (myNum)

2-9  
    aTuple = [ 1, 2, 3, 5, 6]
    myNum = 0
    for i in aTuple:
        myNum += i

    print 'average value is : %f ' % (float(myNum) / len(aTuple))

2-10  
    b = bool(False)
    while b is False:
        num = int(raw_input('input a num among 1 to 100 : '))
        if num >= 1 and num <= 100:
            print 'succeed!'
            break
        else:
            print 'input error!'

2-11  
    def display_menu():
        """展示菜单"""
        print '1.取五个数的和'
        print '2.取五个数的平均值'
        print 'x.退出'
        sel = str(raw_input('输入您的选项:'))
        return sel

    def tuple_sum(aTuple):
        """求和"""
        num = 0
        for i in aTuple:
            num += i
        return num

    aTuple = (1, 2, 3, 4, 6)
    while True :
        sel = display_menu()
        if sel == str('1'):
            print 'num is : %d ' % tuple_sum(aTuple)
        elif sel == str('2'):
            print 'average is : %f ' % (float(tuple_sum(aTuple))/len(aTuple))
        elif sel == str('x'):
            break
        else:
            continue

2-15  
(a)  
    num1 = int(raw_input('input num1:'))
    num2 = int(raw_input('input num2:'))
    num3 = int(raw_input('input num3:'))
    if num1 > num2:
        tmp = num2
        num2 = num1
        num1 = tmp
    if num2 > num3:
        tmp = num3
        num3 = num2
        num2 = tmp
    if num1 > num2:
        tmp = num2
        num2 = num1
        num1 = tmp

    print 'min to max is %d, %d, %d' % (num1, num2, num3)

(b)  
    num1 = int(raw_input('input num1:'))
    num2 = int(raw_input('input num2:'))
    num3 = int(raw_input('input num3:'))
    if num1 < num2:
        tmp = num2
        num2 = num1
        num1 = tmp
    if num2 < num3:
        tmp = num3
        num3 = num2
        num2 = tmp
    if num1 < num2:
        tmp = num2
        num2 = num1
        num1 = tmp

    print 'min to max is %d, %d, %d' % (num1, num2, num3)

2-16  
    fobj = open('hello.txt', 'r')
    for eachLine in fobj:
        print eachLine,
    fobj.close()

