import {
  Activity,
  FileText,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  description: string
  href: string
  icon: LucideIcon
}

export interface NavSection {
  label: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: '工作台',
    items: [
      {
        label: '运行概览',
        description: '查看 Agent 接入和工作状态',
        href: '/',
        icon: LayoutDashboard,
      },
      {
        label: '实时输出',
        description: '查看 AI Agent 流式返回',
        href: '/stream',
        icon: Activity,
      },
      {
        label: '知识文档',
        description: '上传公众号运营所需的 Markdown',
        href: '/knowledge',
        icon: FileText,
      },
    ],
  },
]
