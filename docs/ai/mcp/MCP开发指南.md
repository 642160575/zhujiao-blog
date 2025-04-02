---

tag: AI
---



# MCP 开发指南

## 目录
1. [简介](#简介)
2. [环境搭建](#环境搭建)
3. [基本概念](#基本概念)
4. [服务器开发](#服务器开发)
5. [核心功能实现](#核心功能实现)
6. [示例代码](#示例代码)
7. [最佳实践](#最佳实践)

## 简介

MCP（Model Context Protocol）是一个用于构建AI上下文服务的协议。它允许我们创建服务器来为AI模型提供结构化的数据和功能。本指南将详细介绍如何开发一个MCP服务。

## 环境搭建

### 1. 项目初始化

```bash
# 创建新项目目录
mkdir my-mcp-server
cd my-mcp-server

# 初始化npm项目
npm init -y

# 安装必要依赖
npm install @modelcontextprotocol/sdk
npm install typescript @types/node --save-dev
```

### 2. 配置TypeScript

创建 `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "outDir": "./build",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

### 3. 更新package.json

```json
{
  "type": "module",
  "scripts": {
    "build": "tsc && node -e \"require('fs').chmodSync('build/index.js', '755')\"",
    "prepare": "npm run build",
    "watch": "tsc --watch"
  }
}
```

## 基本概念

MCP服务器包含三个核心概念：

1. **Resources（资源）**
   - 代表可被AI访问的数据
   - 通过URI标识
   - 包含MIME类型和内容

2. **Tools（工具）**
   - 提供可执行的功能
   - 定义输入参数schema
   - 返回执行结果

3. **Prompts（提示）**
   - 为AI提供结构化的提示
   - 可以包含嵌入的资源
   - 支持多轮对话格式

## 服务器开发

### 1. 创建服务器实例

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);
```

### 2. 处理请求

MCP服务器需要实现以下主要请求处理器：

- ListResourcesRequestSchema
- ReadResourceRequestSchema
- ListToolsRequestSchema
- CallToolRequestSchema
- ListPromptsRequestSchema
- GetPromptRequestSchema

## 核心功能实现

### 1. 资源管理

```typescript
// 列出可用资源
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "example:///resource1",
        mimeType: "text/plain",
        name: "示例资源",
        description: "这是一个示例资源"
      }
    ]
  };
});

// 读取资源内容
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  return {
    contents: [{
      uri: request.params.uri,
      mimeType: "text/plain",
      text: "资源内容"
    }]
  };
});
```

### 2. 工具实现

```typescript
// 列出可用工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "example_tool",
        description: "示例工具",
        inputSchema: {
          type: "object",
          properties: {
            param1: {
              type: "string",
              description: "参数1说明"
            }
          },
          required: ["param1"]
        }
      }
    ]
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "example_tool": {
      const param1 = String(request.params.arguments?.param1);
      return {
        content: [{
          type: "text",
          text: `工具执行结果: ${param1}`
        }]
      };
    }
    default:
      throw new Error("未知工具");
  }
});
```

### 3. 提示系统

```typescript
// 列出可用提示
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "example_prompt",
        description: "示例提示",
      }
    ]
  };
});

// 获取提示内容
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "这是提示内容"
        }
      }
    ]
  };
});
```

## 示例代码

### 完整的笔记系统示例

```typescript
type Note = { title: string, content: string };

const notes: { [id: string]: Note } = {};

// 资源处理
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.entries(notes).map(([id, note]) => ({
      uri: `note:///${id}`,
      mimeType: "text/plain",
      name: note.title,
      description: `笔记: ${note.title}`
    }))
  };
});

// 工具处理
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_note",
        description: "创建新笔记",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "笔记标题"
            },
            content: {
              type: "string",
              description: "笔记内容"
            }
          },
          required: ["title", "content"]
        }
      }
    ]
  };
});

// 提示处理
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const embeddedNotes = Object.entries(notes).map(([id, note]) => ({
    type: "resource" as const,
    resource: {
      uri: `note:///${id}`,
      mimeType: "text/plain",
      text: note.content
    }
  }));

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "请总结以下笔记："
        }
      },
      ...embeddedNotes.map(note => ({
        role: "user" as const,
        content: note
      }))
    ]
  };
});
```

## 最佳实践

1. **错误处理**
   - 始终进行输入验证
   - 提供清晰的错误信息
   - 使用try-catch处理异常

2. **URI设计**
   - 使用有意义的URI scheme
   - 保持URI结构一致性
   - 确保URI唯一性

3. **类型安全**
   - 充分利用TypeScript类型系统
   - 定义清晰的接口
   - 避免使用any类型

4. **代码组织**
   - 模块化设计
   - 分离业务逻辑
   - 使用常量管理配置

5. **测试**
   - 编写单元测试
   - 进行集成测试
   - 测试错误情况

6. **文档**
   - 详细的API文档
   - 清晰的代码注释
   - 使用示例说明

## 运行和调试

1. **启动服务**
```bash
# 构建项目
npm run build

# 运行服务
node build/index.js
```

2. **使用Inspector**
```bash
# 运行inspector工具
npx @modelcontextprotocol/inspector build/index.js
```

3. **调试技巧**
- 使用console.log进行日志记录
- 设置断点调试
- 监控错误输出

## 注意事项

1. 确保所有异步操作都正确处理
2. 注意内存管理，避免内存泄漏
3. 遵循TypeScript最佳实践
4. 保持代码简洁和可维护性
5. 定期更新依赖包版本
