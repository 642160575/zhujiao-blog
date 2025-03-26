---
tag: AI
date: 2025-03-26 14:33:09
---

# 我用硅基流动API玩转LangChain的奇妙之旅

## **开篇：没有OpenAI Key？没关系！**

"什么？没有OpenAI的API Key还想玩LangChain？" —— 别慌！我发现了一个神奇的替代品：**硅基流动（SiliconFlow）**！它兼容OpenAI的协议，让我能用`ChatOpenAI`无缝对接，就像在肯德基点到了麦当劳的薯条（虽然不太可能，但确实好用）。


## **第一步：设置硅基流动API**

### **1. 配置环境变量**

为了让LangChain乖乖听话，我先设好API Key和基础URL：

python


```python
os.environ["OPENAI_API_KEY"] = "sk-你的硅基流动Key"
os.environ["OPENAI_API_BASE"] = "https://api.siliconflow.cn/v1"
```

### **2. 禁用代理，让请求飞起来**

为了避免网络干扰，我直接关闭所有代理设置：


```python
# 终极代理禁用咒语
os.environ["http_proxy"] = ""
os.environ["https_proxy"] = ""
...（所有可能的代理变量都清空）
```

这就像拔掉了网速限制器，让API请求直连无阻！


## **第二步：召唤AI模型三兄弟**

硅基流动提供了不同的模型，我选了三个性格迥异的AI：

```python
# 1. 学霸型 - DeepSeek-V3（精准回答）
llm_v3 = ChatOpenAI(model="deepseek-ai/DeepSeek-V3", temperature=0.7)

# 2. 标准型 - DeepSeek-R1（平衡输出）
llm_r1 = ChatOpenAI(model="deepseek-ai/DeepSeek-R1", temperature=0.7)

# 3. 创意型 - 调高温度的R1（放飞自我）
llm_r1_creative = ChatOpenAI(..., temperature=0.9)
```

**温度（temperature）参数就像AI的脑洞大小**：

- **0.7**：理性思考，答案靠谱
- **0.9**：开始天马行空，甚至可能给你写首诗


## **第三步：让AI听懂人话——提示词工程**

### **1. 默认模板：翻译官模式**


```python
messages = [
    ("system", "You are a translator English to Chinese."),
    ("human", "I love programming.")
]
response = llm_r1.invoke(messages)
```

输出：`"我爱编程。"` —— 比某些翻译软件还准！

### **2. 自定义模板：万能语言转换器**


```python
prompt = ChatPromptTemplate.from_messages([
    ("system", "Translate {input_language} to {output_language}."),
    ("human", "{input}")
])

chain = prompt | llm_r1
response = chain.invoke({
    "input_language": "English",
    "output_language": "Chinese",
    "input": "I love programming."
})
```

这就像给AI装了个**万能翻译插件**，想翻什么语言都行！


## **第四步：给AI装上瑞士军刀——工具调用**

虽然还没接入真实API，但我们可以先定义工具，让AI学会"思考"如何完成任务：


```python
from pydantic import BaseModel, Field

class GetWeather(BaseModel):
    """获取某地天气"""
    location: str = Field(..., description="城市和州，例如：San Francisco, CA")

llm_with_tools = llm_v3.bind_tools([GetWeather], strict=True)
response = llm_with_tools.invoke("旧金山天气怎么样？")
```

AI会返回一个结构化的请求，比如：


```python
{"location": "San Francisco, CA"}
```

未来只要接入真实天气API，AI就能自动查询了！


## **第五步：流式传输——让AI像真人一样"打字"**

想让AI的回答像聊天软件一样逐字输出？用`stream`模式！


```python
for token in llm_v3.stream("旧金山天气怎么样？"):
    print(token.text(), end="", flush=True)
```

效果：

`"旧...金...山...的...天...气...晴...朗..."`

**用户体验直接拉满！**


## **总结：从零到一的AI魔法之旅**

1. **发现硅基流动**：OpenAI的完美平替
2. **调教AI模型**：学霸型、标准型、创意型
3. **设计提示词**：让AI精准理解需求
4. **工具扩展**：未来可接入真实API
5. **流式输出**：让AI更像真人对话

**最大的收获**：**没有OpenAI Key，照样玩转LangChain！**

> "任何一个足够先进的科技，初看都与魔法无异。" —— 阿瑟·克拉克
> 

**你的AI冒险开始了吗？** 🚀

（代码仓库：[假装这里有个链接] | 下期预告：《LangChain + 国产大模型的更多骚操作》）