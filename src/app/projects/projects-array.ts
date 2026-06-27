export const tagStyles: Record<string, string> = {
  Rust: 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:border-orange-400/30 dark:bg-orange-400/10 dark:text-orange-200',
  CLI: 'border-slate-500/30 bg-slate-500/10 text-slate-700 dark:border-slate-400/30 dark:bg-slate-400/10 dark:text-slate-200',
  Vue: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200',
  React: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-200',
  SPA: 'border-pink-500/30 bg-pink-500/10 text-pink-700 dark:border-pink-400/30 dark:bg-pink-400/10 dark:text-pink-200',
  JavaScript: 'border-yellow-500/35 bg-yellow-500/10 text-yellow-800 dark:border-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-200',
  TypeScript: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-200',
  Node: 'border-green-500/30 bg-green-500/10 text-green-700 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-200',
  Electron: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-200',
  Capacitor: 'border-teal-500/30 bg-teal-500/10 text-teal-700 dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-200',
  Mediapipe: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:border-fuchsia-400/30 dark:bg-fuchsia-400/10 dark:text-fuchsia-200',
  串口通信: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200',
}

const projects = [
  {
    title: 'Pipto',
    href: 'https://pipto.henryge.com/',
    img: '/images/projects-intro/pipto.png',
    description: '结构优先的 JSON/PPT 转换工具链',
    tags: ['PPT', 'JSON'],
  },
  {
    title: 'ibuild',
    href: 'https://github.com/gezhiheng/ibuild',
    img: '/images/projects-intro/ibuild.png',
    description: '一个 Rust CLI 工具，用于构建多个前端项目并将它们的产物合并到同一个 dist 目录下',
    tags: ['Rust', 'CLI'],
  },
  {
    title: 'Targiyio',
    href: 'https://showcase.henryge.com/targiyio.html',
    img: '/images/projects-intro/targiyio.jpg',
    description: 'Targiyio 是一款专为射击训练设计的App',
    tags: ['Capacitor', 'Vue'],
  },
  {
    title: 'Face2Bot',
    href: 'https://showcase.henryge.com/face2bot.html',
    img: '/images/projects-intro/face2bot.png',
    description: '人脸映射控制仿生机械头',
    tags: ['Mediapipe', 'Vue', '串口通信'],
  },
  {
    title: 'HDriveGUI',
    href: 'https://showcase.henryge.com/hdrive.html',
    img: '/images/projects-intro/hdrivegui.png',
    description: 'HDriveGUI 是一款基于 Vue 3 + Vite 开发的可视化上位机软件',
    tags: ['串口通信', 'Vue'],
  },
  {
    title: 'crt-fe',
    href: 'https://www.npmjs.com/package/crt-fe',
    img: '/images/projects-intro/crt-fe.png',
    description: '一键初始化前端项目模板的命令行工具',
    tags: ['Node', 'CLI'],
  },
  {
    title: '文件转档应用',
    href: 'https://github.com/gezhiheng/file-transformer-app',
    img: '/images/projects-intro/file-transformer-app.png',
    description: '自动将机台档案转为Excel文件的跨平台应用',
    tags: ['Electron', 'TypeScript', 'Vue'],
  },
  {
    title: 'ERP系统前端',
    href: 'https://github.com/gezhiheng/lumitek-frontend',
    img: '/images/projects-intro/lumitek-frontend.png',
    description: '为Lumitek公司开发的ERP系统前端，提升内部管理效率',
    tags: ['JavaScript', 'Vue'],
  },
]

export default projects
