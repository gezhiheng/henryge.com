---
name: 葛智恒
title: 软件工程师
email: gezhiheng.me@gmail.com
phone: '13082517630'
github: github.com/gezhiheng
website: henryge.com
---

## 技术栈

- 前端：TypeScript、JavaScript、Vue 3、React、Next.js、HTML、CSS
- 跨端与桌面端：Capacitor、Electron、Web Bluetooth、Web Serial API
- 后端与工程化：Vite、Node.js、Express、Java、MongoDB、MySQL、pnpm Monorepo、GitHub Actions
- 可视化与编辑器：ECharts、Monaco Editor、MediaPipe

## 工作经历

### 全房通 | 全栈开发 | 2026.4 ~ 至今

参与租房 SaaS 系统迭代，负责 H5 与 App 多端业务开发、缺陷修复与上线验证

### 亚信科技 | 前端开发 | 2025.11 ~ 2026.4

独立开发天猫精灵 ChatBot 与智能课件项目，负责前端架构、交互实现、接口联调与发布维护

### 常州海毅欧智能科技 | 前端开发 | 2024.7 ~ 2025.10

独立开发智能射击训练软件，负责 App、Web 管理端、蓝牙传感器通信、轨迹分析与训练回放

### 琉明光电（常州）有限公司 | 软件工程师 | 2022.6 ~ 2024.5

负责公司内部系统维护与迭代，开发前端核心模块、文件转档、数据展示、自动任务与日志功能

## 项目经历

### Pipto

JSON 驱动演示文稿平台

链接：[网址](https://pipto.henryge.com/) [演示](https://pipto.henryge.com/playground/) [GitHub](https://github.com/gezhiheng/pipto)

技术栈：React + Playwright + Vite + TypeScript + Monaco Editor

- 开发 JSON-native 演示文稿工具链，支持预览、PPTX 导入导出与主题定制
- 用 pnpm Monorepo 管理官网、playground 与 **6 个 npm 包**
- 基于 Monaco Editor 实现 JSON 编辑、模板切换、实时预览与导入导出
- 基于 PptxGenJS、JSZip 解析 Office Open XML，实现 **JSON ⇄ PPTX** 双向转换
- 搭建 Next.js 官网和中英文文档，完善 SEO、sitemap 与文档路由
- 建立 Vitest、npm 烟测和 Playwright 视觉回归，保障发布稳定

### Targiyio

射击训练 App

链接：[网址](https://showcase.henryge.com/targiyio.html)

技术栈：Vue3 + Capacitor + ECharts + MediaPipe + Express + MongoDB

- 使用 Capacitor 构建跨平台 App，适配 iOS / Android / Web
- 利用 Web Bluetooth / Capacitor Bluetooth-LE 与**传感器实时通信**，采集射击轨迹数据
- 针对传感器采样数据构建线性插值、阶段识别与样条平滑流程，在 ECharts 中展示轨迹
- 集成 MediaPipe 实时动作识别模块，**辅助训练者调整动作**，并缓存关键帧用于训练分析
- 构建训练记录回放组件，使用 ECharts 展示射击轨迹并支持轨迹回放
- 通过 IndexedDB 做本地离线缓存，结合 Express + MongoDB 实现多端数据同步

<!-- pdf-page-break -->

### HDriveGUI

基于 Vue 3 的可视化上位机软件

链接：[网址](https://showcase.henryge.com/hdrive.html)

- 基于 Vue 3 + Vite 开发，通过 Web Serial API 与 Modbus 协议实现上位机**实时数据轮询与解析**
- 集成 ECharts，支持多模式（速度、力矩、零力矩）数据可视化与动态切换
- 封装 web-serial-modbus 与 CRC 校验逻辑，确保通信稳定性与数据准确性
- 使用 Pinia 管理全局状态，配合 lodash.debounce 优化高频事件处理
- 基于 Vuetify + UnoCSS 构建现代化界面，提升用户交互体验

### face2bot

基于人脸识别的仿生机械头控制

链接：[网址](https://showcase.henryge.com/face2bot.html)

- 使用 MediaPipe 提供的人脸检测模型，识别 468 个面部关键点坐标
- 选取有代表性的关键点（如眉毛、眼睑、嘴唇等），并计算它们之间的距离或轴向偏移
- 利用这些特征点的偏移量控制对应的舵机角度，实现**实时面部动作同步**
- 通过 Web Serial API 将控制指令发送给下位机，从而驱动舵机动作

### file-transformer-app

基于 Electron + Vue 3 的跨平台文件转档应用

链接：[GitHub](https://github.com/gezhiheng/file-transformer-app)

- 基于 Electron + Vue 3 开发，支持 Windows/macOS/Linux 跨平台运行
- 自动识别不同机型（分选/点测）档案格式并转换为 Excel
- 实现每日定时任务与实时路径监听，自动触发转档并生成日志
- 支持路径持久化保存与手动转档操作

## 开源经历

- 独立开发并开源 Pipto，提供 JSON-native 演示文稿 workspace，包含官网、playground 与 JSON/PPTX 转换、浏览器预览等 npm 包，核心包 json2pptx 周下载 **600+** [npm](https://www.npmjs.com/package/json2pptx)
- markstream-vue 流式渲染库部分 Bug 修复和文档修复 [GitHub](https://github.com/gezhiheng/vue-markdown-renderer)
- 独立发布 npm 包 crt-fe 快速初始化前端项目，周下载 **200+** [npm](https://www.npmjs.com/package/crt-fe)
- 向 Element Plus 提交文档修正 PR 并被合并 [GitHub](https://github.com/element-plus/element-plus/pull/15215)

## 教育经历

- 大专 | 江苏联合职业技术学院 | 计算机应用 | 2017.9 ~ 2022.7
