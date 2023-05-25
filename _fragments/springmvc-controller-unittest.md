---
layout: fragment
title: SpringMVC Controller 单元测试示例
tags: [java]
description: SpringMVC Controller 单元测试示例
keywords: Java, Spring, SpringMVC
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@Slf4j
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(value = {"classpath:applicationContextTest.xml","classpath:applicationContext-common.xml"})
@WebAppConfiguration
public class XxxControllerTest {
    @Autowired
    private WebApplicationContext webApplicationContext;

    protected MockMvc mockMvc;

    @Before
    public void setup(){
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void testX() {
        ResultActions resultActions = mockMvc.perform(
                MockMvcRequestBuilders.post("/x/xx")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .requestAttr("user", "xxx")
                .param("id", "xxx")
                );
        MvcResult mvcResult = resultActions
            .andDo(MockMvcResultHandlers.print())
            .andExpect(MockMvcResultMatchers.status().isOk())
            .andReturn();
        String result = mvcResult.getResponse().getContentAsString();
        log.info("响应内容：{}", result);
    }
}
```
