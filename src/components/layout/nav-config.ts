import {
  BookOpenText,
  Bot,
  Headphones,
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
    label: '智能工作台',
    items: [
      {
        label: '知识库',
        description: '沉淀企业资料与内容规范',
        href: '/knowledge-base',
        icon: BookOpenText,
      },
      {
        label: 'AI 创作',
        description: '按主题生成公众号内容',
        href: '/ai-creation',
        icon: Bot,
      },
      {
        label: '企业客服',
        description: '统一管理客户咨询与服务',
        href: '/customer-service',
        icon: Headphones,
      },
    ],
  },
]
