---
layout: post
title: 最长公共子问题 JAVA
categories: Prolems
description: 最长公共子问题 JAVA
keywords: 最长公共子字符串,JAVA
---

常用到求两个字符串的最长公共子问题，在这里记录下。

## 最长公共子序列问题（不需要连续） ##

1. 第一种解题方法是动态规划，dp[i][j]代表两个字符串从头分别到第i，j的位置有多少公共子字符串。之后用循环一直循环到头就可以了。

2. 第二种解题法是递归，相同就继续往后走，不同了就分别找两个后面大的子字符串数量。

``` java
public class Solution{
    public static void main(String[] args) {
        System.out.println(getLCS2("str", "str2"));
    }
    static int getLCS(String str, String str2){
        int n1 = str.length();
        int n2 = str2.length();
        int[][] dp = new int[n1+1][n2+1];
        for(int i=1;i<=n1;i++){
            for(int j=1;j<=n2;j++){
                if(str.charAt(i-1)==str2.charAt(j-1)){ //此处应该减1.
                    dp[i][j]=dp[i-1][j-1]+1;
                }else{
                    dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
                }
            }
        }
        return dp[n1][n2];
    }
    static int getLCS2(String str, String str2){
        if(str.length()==0||str2.length()==0) return 0;
        if(str.charAt(0)==str2.charAt(0)){
            return 1+getLCS2(str.substring(1),str2.substring(1));
        }else{
            return Math.max(getLCS2(str,str2.substring(1)), getLCS2(str2,str.substring(1)));
        }
    }
}
```

## 最长公共子字符串 ##

还是动态规划最方便，与子序列不同的是，dp[i][j]代表了到i，j位置的长度，如果不同了不在是找之前最大，而是长度归0，所以最后还要遍历dp，找最大

``` java
public class Solution{
    public static void main(String[] args) {
        System.out.println(maxLength("465465stfr", "str2"));
    }
    static int maxLength(String str, String str2){
        int n1 = str.length();
        int n2 = str2.length();
        int[][] dp = new int[n1+1][n2+1];
        int max = 0;
        for(int i=1;i<=n1;i++){
            for(int j=1;j<=n2;j++){
                if(str.charAt(i-1)==str2.charAt(j-1)){ //此处应该减1.
                    dp[i][j]=dp[i-1][j-1]+1;
                    max = Math.max(dp[i][j],max);
                }else{
                    dp[i][j]=0;//这行可以不要，默认就是0
                }
            }
        }
        return max;
    }
}
```
