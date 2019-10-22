---
layout: post
title: leetcode42 java
categories: Prolems
description: leetcode42 java解法
keywords: leetcode
---
## 题目描述

Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it is able to trap after raining.
![leetcode42](/images/posts/problems/leetcode42/rainwatertrap.png)
**Example:**  
Input: [0,1,0,2,1,0,1,3,2,1,2,1]  
Output: 6

## 解法

找到中间最高的分别往两边看，最左边和最右边分别往中间最高的走，这样每次两边都是最高的一定能把中间围起来一个面积。这样时间复杂度也只是O(2n)

## 代码

``` java
class Solution {
    //找到中间最高了，
    public int trap(int[] height) {
        if(height.length==0) return 0;
        int maxHeight = height[0];
        int maxIndex = 0;
        int res = 0;
        for(int i=0;i<height.length;i++){
            if(height[i]>maxHeight){
                maxHeight = height[i];
                maxIndex = i;
            }
        }
        //从左边开始
        int maxLeft = height[0];
        for(int i=1;i<maxIndex;i++){
            if(maxLeft>height[i]){
                res+=maxLeft-height[i];
            }else{
                maxLeft = height[i];
            }
        }
        //从右边开始
        int maxRight = height[height.length-1];
        for(int i=height.length-2;i>maxIndex;i--){
            if(maxRight>height[i]){
                res+=maxRight-height[i];
            }else{
                maxRight = height[i];
            }
        }
        return res;
    }
}
```
