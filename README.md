# 项目介绍

本项目是一个基于 Vue 3、TypeScript 和 Vite 构建的区块链交易查询与统计工具。用户可以通过输入 BSC 地址，查询该地址的交易记录，并统计每日和总交易量、消耗总量以及获得的积分。

## 技术栈
- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **日期处理**：dayjs
- **图标库**：lucide-vue-next
- **API 调用**：原生 Fetch API

## 功能特性
1. **地址搜索**：支持输入 BSC 地址进行搜索，验证地址有效性，并将搜索历史保存到本地。
2. **数据统计**：实时计算并展示每日和总交易量、消耗总量、获得积分。
3. **交易记录展示**：以时间分组展示最近 15 天的交易记录，支持展开查看详细信息。
4. **价格查询**：通过 Binance API 获取代币价格，并进行缓存以减少请求次数。

## 安装步骤
```bash
pnpm install
```

## 运行方法
```bash
pnpm run dev
```

## 项目结构
```plaintext
src/
├── components/
│   ├── Header.vue       # 导航栏组件
│   ├── SearchBar.vue    # 搜索栏组件，支持历史记录管理
│   ├── FilterSlider.vue # 过滤滑块组件
│   ├── DailyStats.vue   # 每日统计信息展示组件
│   ├── OverallStats.vue # 总体统计信息展示组件
│   ├── TransactionHistory.vue # 交易记录展示组件
│   └── Hero.vue         # 首页展示组件
├── utils/
│   ├── api.js           # API 相关工具函数，用于获取交易数据和代币价格
│   ├── validation.js    # 验证工具函数，用于地址、JSON 等验证
│   ├── transaction.js   # 交易处理工具函数，如分组、计算积分等
│   └── storage.js       # 本地存储工具函数
├── App.vue              # 根组件
└── main.ts              # 入口文件
```

## 贡献指南
如果你想为项目做出贡献，请遵循以下步骤：
1. Fork 本仓库。
2. 创建一个新的分支 (`git checkout -b feature/your-feature`).
3. 提交你的更改 (`git commit -am 'Add some feature'`).
4. 推送到分支 (`git push origin feature/your-feature`).
5. 提交 Pull Request.


