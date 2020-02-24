---
layout: post
title: java基础之文件读写和用户输入
categories: java
description: 基础知识
keywords: java,文件
---
刚学java那会的最基本的最简单的文件读写，和接受用户输入都忘光了，回顾一下。

## 文件读写

按行读取

``` java
//打开带读取的文件
BufferedReader br = new BufferedReader(new FileReader("text.txt"));
String line=null;
while((line=br.readLine())!=null) {
	System.out.println(line);
}
br.close();//关闭文件
```

自动换行写入

``` java
OutputStream os = new FileOutputStream("output.txt");
PrintWriter pw=new PrintWriter(os);
for(int i=0;i<10;i++) {
	String s=""+number;
	pw.println(s);//每输入一个数据，自动换行，便于我们每一行每一行地进行读取
	//pw.print(s+",");//不会自动换行，必要时可以自己添加分隔符
	number++;
}
pw.close();
os.close();
```

## 接收用户输入

``` java
Scanner input = new Scanner(System.in);
String test = input.next();//接收单个输入
String s1 = input.nextLine();//接收一行并按空格分隔
String []s2 = s1.split(" ");
```


