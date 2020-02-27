---
layout: post
title: 二叉树遍历
categories: Knowledge
description: 二叉树遍历
keywords: 二叉树遍历
---
二叉树遍历，前序中序后序的递归和非递归实现，还有层序的实现。

![二叉树](/images/posts/knowledge/binaryTree/binaryTree.PNG)

## 前序

访问顺序：先根节点，再左子树，最后右子树；上图的访问结果为：GDAFEMHZ。

递归实现：

``` java
public void preOrder(TreeNode root){
    if(root==null) return null;
    System.out.println(root.val);
    preOrder(root.left);
    preOrder(root.right);
}
```

非递归实现：

``` java
public void preOrder(TreeNode root){
    Stack<TreeNode> stack = new Stack<>();
    while(root!=null||!stack.isEmpty()){
        if(root!=null){
            System.out.println(root.val);
            stack.push(root);
            root=root.left;
        }else{
            TreeNode tmp=stack.pop();
            root=tmp.right;
        }
    }
}
```

## 中序

访问顺序：先左子树，再根节点，最后右子树；上图的访问结果为：ADEFGHMZ。

递归实现：

``` java
public void inOrder(TreeNode root){
    if(root==null) return null;
    inOrder(root.left);
    System.out.println(root.val);
    inOrder(root.right);
}
```

非递归实现：

``` java
public void inOrder(TreeNode root){
    Stack<TreeNode> stack = new Stack<>();
    while(root!=null||!stack.isEmpty()){
        if(root!=null){
            stack.push(root);
            root=root.left;
        }else{
            TreeNode tmp=stack.pop();
            System.out.println(tmp.val);
            root=tmp.right;
        }
    }
}
```

## 后序

访问顺序：先左子树，再右子树，最后根节点，上图的访问结果为：AEFDHZMG。

递归实现：

``` java
public void postOrder(TreeNode root){
    if(root==null) return null;
    postOrder(root.left);
    postOrder(root.right);
    System.out.println(root.val);
}
```

非递归实现：

``` java
public void postOrder(TreeNode root){
    TreeNode cur,pre=null;
    Stack<TreeNode> stack = new Stack<>();
    stack.add(cur);
    while(!stack.isEmpty()){
        cur=stack.peek();
        if((cur.left==null&&cur.right==null)||(pre!=null&&(pre=cur.left||pre=cur.right))){
            System.out.println(cur.val);
            stack.pop();
            pre=cur;
        }else{
            if(cur.right!=null){
                stack.push(cur.right);
            }
            if(cur.left!=null){
                stack.push(cur.left);
            }
        }
    }
    
}
```

## 层序遍历

访问结果：GDMAFHZE。

``` java
public void levelOrder(TreeNode root){
    if(root==null) return null;
    Queue<TreeNode> que = new LinkedList<>();
    que.add(root);
    while(!que.isEmpty()){
        TreeNode tmp = que.poll();
        System.out.println(tmp.val);
        if(tmp.left!=null) que.add(tmp.left);
        if(tmp.right!=null) que.add(tmp.right);
    }
}
```

[参考](https://www.cnblogs.com/zhi-leaf/p/10813048.html)
















