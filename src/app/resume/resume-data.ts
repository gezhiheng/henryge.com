export interface ResumeProfile {
  name: string
  title: string
  email: string
  phone?: string
  github?: string
  website?: string
}

export interface ResumeExperience {
  company: string
  position: string
  start: string
  end: string
  description: string
}

export interface ResumeProjectLink {
  label?: string
  url: string
}

export interface ResumeProject {
  name: string
  description: string
  links?: ResumeProjectLink[]
  techStack?: string
  highlights?: string[]
}

export interface ResumeOpenSourceItem {
  description: string
  link?: string
}

export interface ResumeEducation {
  school: string
  degree: string
  major: string
  start: string
  end: string
}

export interface ResumeSkillGroup {
  category: string
  items: string[]
}

export interface ResumeData {
  profile: ResumeProfile
  skills: ResumeSkillGroup[]
  experiences: ResumeExperience[]
  projects: ResumeProject[]
  openSource: ResumeOpenSourceItem[]
  education: ResumeEducation[]
}

const resumeData: ResumeData = {
  profile: {
    name: '葛智恒',
    title: '软件工程师',
    email: 'gezhiheng.me@gmail.com',
    phone: '13082517630',
    github: 'github.com/gezhiheng',
    website: 'henryge.com',
  },
  skills: [
    {
      category: '语言与基础',
      items: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
    },
    {
      category: '框架与工具',
      items: ['Vue3', 'Pinia', 'Vue Router', 'Element Plus', 'Vuetify', 'UnoCSS', 'Vite', 'Capacitor', 'Electron'],
    },
    {
      category: '后端与运维',
      items: ['Node.js', 'Express', 'MongoDB', 'MySQL', 'Git', 'PM2', 'Nginx', 'CI/CD（GitHub Workflows）'],
    },
  ],
  experiences: [
    {
      company: '亚信科技',
      position: '软件工程师',
      start: '2025.11',
      end: '至今',
      description: '独立开发天猫精灵 ChatBot、智能课件相关项目。',
    },
    {
      company: '南京芽智网络科技',
      position: '前端开发工程师',
      start: '2025.9',
      end: '2025.10',
      description: '负责完成前端构建工具的迁移和维护与迭代 ToB 电商系统。',
    },
    {
      company: '常州海毅欧智能科技',
      position: '前端开发工程师',
      start: '2024.7',
      end: '2025.6',
      description: '负责智能射击训练软件的开发及上位机可视化控制界面等，聚焦软件与硬件之间通信及用户交互的整合。',
    },
    {
      company: '琉明光电（常州）有限公司',
      position: '软件工程师',
      start: '2022.6',
      end: '2024.5',
      description: '负责公司内部系统的维护与迭代、主导公司 ERP 系统的前端与核心模块开发，推动新旧系统替代率达 40%+。',
    },
  ],
  projects: [
    {
      name: 'Pipto',
      description: 'JSON 驱动演示文稿平台',
      links: [
        { url: 'https://github.com/gezhiheng/pipto' },
        { url: 'https://pipto.henryge.com/' },
      ],
      techStack: 'React + Next.js + Vite + TypeScript + Monaco Editor + PptxGenJS + Playwright + pnpm Monorepo',
      highlights: [
        '面向开发者的 JSON-native 演示文稿工具链，将演示内容结构化为 JSON，支持浏览器预览、PPTX 导入导出与主题定制，并以官网、playground 和 npm 包的形式对外提供能力',
        '基于 pnpm Monorepo 组织 website、playground 与 6 个 npm 包，形成 schema 校验、PPTX 导出、PPTX 解析、浏览器预览、主题替换的一体化工作流',
        '使用 Monaco Editor 构建在线 JSON 编辑器，支持代码折叠、模板切换、实时预览、JSON 导出与 PPTX 圆环导入/导出',
        '基于 PptxGenJS、JSZip 与 Office Open XML 解析实现 JSON ⇄ PPTX 双向转换，覆盖文本、形状、图片、线条等常见演示元素',
        '搭建 Next.js 官网与中英文文档站，补充 SEO 元信息、sitemap/robots 与文档路由，提升项目展示与检索能力',
        '建立 Vitest 集成测试、npm 安装烟测与 Playwright 视觉回归测试，保障 round-trip 链路和发布流程稳定性',
      ],
    },
    {
      name: '蜂鸟定制',
      description: '企业级 ToB 电商系统',
      links: [{ url: 'https://www.humcustom.com' }],
      techStack: 'Vue2.7 + Vite',
      highlights: [
        '主导将前端构建工具从 Webpack 迁移至 Vite，兼容 Vue 2.7',
        '优化构建与热更新性能，冷启动时间从 1分43秒 降至 15秒，热更新响应提升至 1 秒内',
        '完成依赖兼容适配、资源路径调整与构建流程优化，显著提升开发体验与构建效率',
      ],
    },
    {
      name: 'Targiyio 射击训练App',
      description: '面向普通用户和运动员的智能射击训练 App，融合传感器、蓝牙、AI 识别与 Web 技术，实现训练数据采集与分析',
      links: [{ url: 'https://showcase.gezhiheng.site/targiyio.html' }],
      techStack: 'Vue3 + Capacitor + ECharts + MediaPipe + Express + MongoDB',
      highlights: [
        '使用 Capacitor 构建跨平台 App，适配 iOS / Android / Web',
        '利用 Web Bluetooth / Capacitor Bluetooth-LE 与传感器实时通信，采集射击轨迹数据',
        '构建含线性插值与阶段识别的轨迹处理流程，最终以样条插值在 ECharts 中平滑展示',
        '集成 MediaPipe 实时动作识别模块，辅助训练者调整动作，并将关键帧绘制缓存用于训练分析',
        '构建训练记录回放组件，使用 ECharts 展示射击轨迹并支持轨迹回放',
        '通过 IndexedDB 做本地离线缓存，结合 Express + MongoDB 实现多端数据同步',
      ],
    },
    {
      name: 'HDriveGUI 可视化上位机',
      description: '基于 Vue 3 的可视化上位机软件',
      links: [{ url: 'https://showcase.gezhiheng.site/hdrive.html' }],
      highlights: [
        '基于 Vue 3 + Vite 开发，通过 Web Serial API 与 Modbus 协议实现上位机实时数据轮询与解析',
        '集成 ECharts，支持多模式（速度、力矩、零力矩）数据可视化与动态切换',
        '封装 web-serial-modbus 与 CRC 校验逻辑，确保通信稳定性与数据准确性',
        '使用 Pinia 管理全局状态，配合 lodash.debounce 优化高频事件处理',
        '基于 Vuetify + UnoCSS 构建现代化界面，提升用户交互体验',
      ],
    },
    {
      name: 'face2bot 基于人脸识别的仿生机械头控制',
      description: '实时捕捉人脸特征点，并将特征点的相对运动映射为控制信号，驱动多个舵机以模拟面部表情动作',
      links: [
        { label: '介绍', url: 'https://showcase.gezhiheng.site/face2bot.html' },
        { label: '演示', url: 'https://face2bot.gezhiheng.site/' },
      ],
      highlights: [
        '使用 Mediapipe 提供的人脸检测模型，识别 468 个面部关键点坐标',
        '选取有代表性的关键点（如眉毛、眼睑、嘴唇等），并计算它们之间的距离或轴向偏移',
        '利用这些特征点的偏移量控制对应的舵机角度，实现面部动作同步',
        '通过 Web Serial API 将控制指令发送给下位机，从而驱动舵机动作',
      ],
    },
    {
      name: 'file-transformer-app 跨平台文件转档应用',
      description: '基于 Electron + Vue 3 的跨平台文件转档应用',
      links: [{ url: 'https://github.com/gezhiheng/file-transformer-app' }],
      highlights: [
        '基于 Electron + Vue 3 开发，支持 Windows/macOS/Linux 跨平台运行',
        '自动识别不同机型（分选/点测）档案格式并转换为 Excel',
        '实现每日定时任务与实时路径监听，自动触发转档并生成日志',
        '支持路径持久化保存与手动转档操作',
      ],
    },
  ],
  openSource: [
    {
      description: '独立开发并开源 Pipto / @henryge/pipto，发布 JSON 转 PPTX、PPTX 转 JSON、浏览器预览等相关 npm 包，配套官网与中英文文档站',
    },
    {
      description: 'markstream-vue 流式渲染库部分 Bug 修复和文档修复',
    },
    {
      description: '独立发布 npm 包 crt-fe 快速初始化前端项目，周下载 200+',
      link: 'https://www.npmjs.com/package/crt-fe',
    },
    {
      description: '向 Element Plus 提交文档修正 PR 并被合并',
      link: 'https://github.com/element-plus/element-plus/pull/15215',
    },
  ],
  education: [
    {
      school: '江苏联合职业技术学院',
      degree: '大专',
      major: '计算机应用',
      start: '2017.9',
      end: '2022.7',
    },
  ],
}

export default resumeData
