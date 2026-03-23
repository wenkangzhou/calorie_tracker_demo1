# CalorieTracker - 饮食热量追踪应用

一个功能完整、设计精美的饮食热量追踪应用，帮助用户记录每日饮食、追踪热量摄入和营养成分。

## 功能特性

### 核心功能
1. **仪表板** - 显示每日热量摄入/消耗的圆形进度指示器，包含个性化问候语、日期选择器和宏量营养素卡片
2. **食物数据库** - 内置 40+ 种常见食物的详细营养信息
3. **食物搜索** - 实时搜索食物，支持模糊匹配和分类筛选
4. **食物详情** - 显示食物营养信息、份量选择和添加到餐食的功能
5. **餐食记录** - 支持早餐、午餐、晚餐和零食的分类记录
6. **进度追踪** - 显示整体进度百分比、连续打卡天数、营养指标
7. **个人资料** - 目标设置、主题切换、语言切换

### 设计特点
- 绿色健康主题配色 (#22c55e, #16a34a)
- 现代简洁的移动端设计
- 圆角卡片布局，清晰的视觉层次
- 圆形进度条、平滑页面切换动画
- Lucide React 图标系统

### 技术特性
- **多语言支持** - 中文/英文切换
- **主题模式** - 浅色/深色/跟随系统
- **响应式设计** - 移动端优先，最大宽度 480px
- **本地存储** - 数据持久化到本地存储
- **流畅动画** - Framer Motion 实现

## 技术栈

- **框架**: Next.js 16 + React 19 + TypeScript
- **样式**: Tailwind CSS 4 + shadcn/ui
- **状态管理**: Zustand
- **动画**: Framer Motion
- **图表**: Recharts
- **国际化**: i18next
- **图标**: Lucide React
- **日期处理**: date-fns

## 部署到 Vercel

### 方式一：使用 Vercel CLI

1. 安装 Vercel CLI:
```bash
npm i -g vercel
```

2. 登录 Vercel:
```bash
vercel login
```

3. 部署:
```bash
cd my-app/dist
vercel --prod
```

### 方式二：使用 Vercel Dashboard

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 导入 GitHub 仓库或拖拽 `dist` 文件夹
4. 点击 Deploy

### 方式三：使用 Vercel API Token

```bash
# 设置环境变量
export VERCEL_TOKEN=your_token_here

# 部署
vercel --token=$VERCEL_TOKEN --prod
```

## 本地开发

```bash
# 安装依赖
cd my-app
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
my-app/
├── app/                  # Next.js 页面
│   ├── page.tsx         # 仪表板
│   ├── search/          # 搜索页面
│   ├── food/[id]/       # 食物详情页
│   ├── progress/        # 进度页面
│   └── profile/         # 个人资料页
├── components/          # 组件
│   ├── ui/             # shadcn 组件
│   └── *.tsx           # 自定义组件
├── stores/             # Zustand 状态管理
├── lib/                # 工具函数和数据
├── types/              # TypeScript 类型
└── dist/               # 构建输出
```

## 数据模型

### 食物数据
- 40+ 种内置食物
- 每份营养信息（热量、碳水、蛋白质、脂肪、纤维）
- 分类：主食、肉类、蔬菜、水果、零食、饮品

### 用户数据
- 每日热量目标（默认 1200 kcal）
- 宏量营养素目标
- 语言/主题偏好
- 连续打卡天数

### 餐食记录
- 日期、餐别类型
- 食物 ID 和数量
- 自动计算总热量

## 浏览器支持

- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)
- 移动端浏览器

## License

MIT
