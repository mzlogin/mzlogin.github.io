---
layout: post
title: ANSI Common Lisp 第二章习题解答
categories: Lisp
description: 学习 ANSI Common Lisp 第二章欢迎来到 Lisp 的笔记。
keywords: Lisp
---

本文是个人对[第二章：欢迎来到 Lisp——ANSI Common Lisp 中文版](http://acl.readthedocs.org/en/latest/zhCN/ch2-cn.html) 一文中习题的解答。

**1. 描述下列表达式求值之后的结果：**

(a) (+ (- 5 1) (+ 3 7))

**答案：**`14`

(b) (list 1 (+ 2 3))

**答案：**`(1 5)`

(c) (if (listp 1) (+ 1 2) (+ 3 4))

**答案：**`7`

(d) (list (and (listp 3) t) (+ 1 2))

**答案：**`(NIL 3)`

**2. 给出 3 种不同表示 (a b c) 的 cons 表达式 。**

**答案：**

```cl
(cons 'a '(b c))
(cons 'a (cons 'b '(c)))
(cons 'a (cons 'b (cons 'c nil)))
```

**3. 使用 car 与 cdr 来定义一个函数，返回一个列表的第四个元素。**

**答案：**

```cl
(defun get-forth(lst)
  (car (cdr (cdr (cdr lst)))))
```

**4. 定义一个函数，接受两个实参，返回两者当中较大的那个。**

**答案：**

```cl
(defun get-max(x y)
  (if (< x y)
    y
    x))
```

**5. 这些函数做了什么？**

(a)

```cl
(defun enigma (x)
  (and (not (null x))
       (or (null (car x))
           (enigma (cdr x)))))
```

**答案：**判断 x 列表中是否有 nil 元素

(b)

```cl
(defun mystery (x y)
  (if (null y)
    nil
    (if (eql (car y) x)
      0
      (let ((z (mystery x (cdr y))))
        (and z (+ z 1))))))
```

**答案：**查找 x 在列表 y 中的下标，如果没有则为 nil

**6. 下列表达式， x 该是什么，才会得到相同的结果？**

(a) > (car (x (cdr '(a (b c) d))))

    B

**答案：**`car`

(b) > (x 13 (/ 1 0))

    13

**答案：**`or`

(c) > (x #'list 1 nil)

    (1)

**答案：**`or '(1)` 或 `apply`

**7. 只使用本章所介绍的操作符，定义一个函数，它接受一个列表作为实参，如果有一个元素是列表时，就返回真。**

**答案：**

非递归版本

```cl
(defun has-child-list (lst)
  (let ((x nil))
    (dolist (obj lst)
      (setf x (or x (listp obj))))
    x))
```

递归版本

```cl
(defun has-child-list-re (lst)
  (if (null lst)
    nil
    (if (listp (car lst))
      t
      (has-child-list-re (cdr lst)))))
```

**8. 给出函数的迭代与递归版本：**

a. 接受一个正整数，并打印出数字数量的点。

**答案：**

非递归版本

```cl
(defun print-dots (n)
  (do ((i 0 (+ i 1)))
    ((= i n ) 'done)
    (format t ".")))
```

递归版本

```cl
(defun print-dots-re (n)
  (if (= n 0)
    'done
    (progn
      (format t ".")
      (print-dots-re (- n 1)))))
```

b. 接受一个列表，并返回 a 在列表里所出现的次数。

**答案：**

非递归版本：

```cl
(defun print-a-times (lst)
   (let ((flag 'a)(x 0))
     (dolist (obj lst)
       (setf x (+ x (if (eql obj flag) 1 0))))
     x))
```

递归版本：

```cl
(defun print-a-times-re (lst)
  (if (null lst)
    0
    (let ((flag 'a))
      (+ (if (eql flag (car lst)) 1 0)
         (print-a-times-re (cdr lst))))))
```

**9. 一位朋友想写一个函数，返回列表里所有非 nil 元素的和。他写了此函数的两个版本，但两个都不能工作。请解释每一个的错误在哪里，并给出正确的版本。**

(a)

```cl
(defun summit (lst)
  (remove nil lst)
  (apply #'+ lst))
```

**答案：**因为 remove 并不会改变 lst 本身。正确的程序：

```cl
(defun summit (lst)
  (let ((newlst (remove nil lst)))
    (apply #'+ newlst)))
```

(b)

```cl
(defun summit (lst)
  (let ((x (car lst)))
    (if (null x)
      (summit (cdr lst))
      (+ x (summit (cdr lst))))))
```

**答案：**因为递归没有边界退出分支。正确的程序：

```cl
(defun summit (lst)
  (if (null lst)
    0
    (let ((x (car lst)))
      (if (null x)
        (summit (cdr lst))
        (+ x (summit (cdr lst)))))))
```
