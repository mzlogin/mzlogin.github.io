---
layout: post
title: 计蒜客·藏宝图（bfs+状态压缩）
categories: 算法
description: 计蒜客·藏宝图（bfs+状态压缩）
keywords: 算法
---

## 1 藏宝图

蒜头君得到一张藏宝图。藏宝图是一个 10×10 的方格地图，图上一共有 10 个宝藏。有些方格地形太凶险，不能进入。

![1](/assets/img/blog/2018/07/13/1.png)


整个图只有一个地方可以出入，即是入口也是出口。蒜头君是一个贪心的人，他规划要获得所有宝藏以后才从出口离开。

藏宝图上从一个方格到相邻的上下左右的方格需要1天的时间，蒜头君从入口出发，找到所有宝藏以后，回到出口，最少需要多少天。

## 2 解题报告

参数 state 使用状态压缩记录宝藏是否被蒜头君找到，通过 record[x][y][state] 记录到达 (x,y) 节点时，不同 state 所耗费的最小步数，然后 bfs 搜索：

``` java
public class Main {
    /** 宝箱编号0-9 */
    private static char[][] map = {
            {'.', '.', '.', '.', '.', '.', '.', '0', '.', '.'},
            {'.', '.', '.', 'X', '.', '.', '1', '.', '.', '.'},
            {'.', 'X', '.', '.', '2', '.', '.', 'X', '.', '.'},
            {'.', '3', '.', '.', '.', 'X', '.', '.', '4', '.'},
            {'.', 'X', '.', '.', '5', '.', 'X', '.', '.', '.'},
            {'.', '.', 'X', '.', '.', '.', '.', 'X', '.', '.'},
            {'.', '.', '.', '.', '.', 'X', '.', '.', '6', '.'},
            {'.', 'X', '.', 'X', '.', '.', '7', '.', '.', '.'},
            {'.', '8', '.', '.', '.', '.', 'X', 'X', '.', '.'},
            {'.', '.', 'X', '.', '.', 'X', '9', '.', '.', '.'}
    };

    /** 方向 */
    private static int[][] dir = { {0, -1},{0, 1},{-1, 0},{1, 0} };

    /** [x][y][state]记录到达x,y节点时,状态为state的最小步数 */
    private static int[][][] record = new int[10][10][1 << 10];
    
    /** 节点*/
    private static class Node {
        int x;
        int y;
        int state; // 压缩状态
        Node next = null; // 链式存储

        public Node(int x, int y, int state) {
            this.x = x;
            this.y = y;
            this.state = state;
        }
    }
    
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        System.out.println(bfs()); // 48
        long end = System.currentTimeMillis();
        System.out.println(end - start + "ms"); // 22ms
    }

    private static int bfs() {
        Node head = new Node(0, 0, 0);
        Node p = head;
        Node tail = head;
        while (null != p) {
            Node t = p;
            // 如果当前节点走到出口且记录了所有宝箱状态，则返回最小步数
            if (t.x == 0 && t.y == 0 && t.state == ((1 << 10) - 1)) {
                return record[0][0][(1 << 10) - 1];
            }
            // bfs
            for (int i = 0; i < 4; i++) {
                int tx = t.x + dir[i][0];
                int ty = t.y + dir[i][1];
                // 非法路径校验
                if (in(tx, ty, t)) {
                    int ts = t.state;
                    // 如果走到宝箱上，且没有记录过这个宝箱的状态，记录这个宝箱状态
                    if (map[tx][ty] >= '0' && map[tx][ty] <= '9') {
                        int id = map[tx][ty] - '0';
                        if ((t.state & (1 << id)) == 0) {
                            ts += (1 << id);
                        }
                    }
                    // 记录步数，增加bfs节点
                    record[tx][ty][ts] = record[t.x][t.y][t.state] + 1;
                    tail.next = new Node(tx, ty, ts);
                    tail = tail.next;
                }
            }
            p = p.next;
        }
        return -1;
    }

    private static boolean in(int x, int y, Node node) {
        return (x >= 0
                && x < 10
                && y >= 0
                && y < 10
                && map[x][y] != 'X'
                && record[x][y][node.state] == 0
        );
    }
}
```