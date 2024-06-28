---
layout: post
title: template page
categories: [cate1, cate2]
description: some word here
keywords: keyword1, keyword2
mermaid: true
sequence: true
flow: true
mathjax: true
mindmap: true
mindmap2: true
---

## Hello World!

# test_chapter

```python
print("Hello World!")
```
$$
\sum_{i=1}^n a_i = 0
$$

**hello**

*world*

```mermaid
graph LR
A[Hard edge] -->|Link text| B(Round edge)
B --> C{Decision}
C -->|One| D[Result one]
C -->|Two| E[Result two]
``` 

```sequence          
A->B: Does something
B->C: Does something else
C->D: Does one last thing
``` 

```flow 
st=>start: Start
e=>end: End
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes or No?


st->op1->cond
cond(yes)->sub1
cond(no)->op1
```

```math
\begin{align*}
\dot{x} & = \sigma(y-x) \\
\dot{y} & = \rho x - y - xz \\
\dot{z} & = -\beta z + xy
\end{align*}
```

```mindmap
* root
    * child1
    * child2
        * subchild1
        * subchild2
```

```mindmap2
* root
    * child1
    * child2
        * subchild1
        * subchild2
```

