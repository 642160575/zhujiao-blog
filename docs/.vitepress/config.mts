import { defineConfig } from 'vitepress'

// 导入主题的配置
import { blogTheme } from './blog-theme'

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// 如果项目名已经为 name.github.io 域名，则不需要修改！
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/vitepress-blog-sugar-template/'
//   : '/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  // base,
  lang: 'zh-cn',
  title: '主教的成長記錄',
  description: '',
  lastUpdated: true,
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  themeConfig: {
    // 展示 2,3 级标题在目录中
    outline: {
      level: [2, 3],
      label: '目录'
    },
    // 默认文案修改
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '相关文章',
    lastUpdatedText: '上次更新于',

    // 设置logo
    logo: '/logo.jpg',
    nav: [
      { text: '首页', link: '/' },
      { text: '日常', items: [
        { text: '游戏', link: '/game/index' },
      ] },
      {
        text: '我的半年计划', items: [
          { text: '英语口语学习', link: '/half-plans/index' },
        ]
      },
        {
            text: 'AI学习', items: [
                {text: 'LangChain', link: '/ai/LangChain/index'},
                {text: 'MCP', link: '/ai/mcp/index'}
                ]
        },
      { text: '后端', items: [
        { text: 'Django', link: '/后端/index' },
      ] },
      { text: '对接文档流程', items: [
        { text: 'Amazon', link: '/amazon/index' },
      ] },
      { text: '关于我', link: '/1' },
      
    ],
    socialLinks: [
      {
        icon: 'csdn',
        link: 'https://blog.csdn.net/qq_25218219?spm=1000.2115.3001.5343'
      }
    ]
  }
})
