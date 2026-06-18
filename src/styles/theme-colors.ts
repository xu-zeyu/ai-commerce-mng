export type ThemeColorKey = 'amber' | 'ocean' | 'mint' | 'violet' | 'rose' | 'graphite'

export interface ThemeColorOption {
  key: ThemeColorKey
  label: string
  swatch: string
}

export const THEME_COLORS: ThemeColorOption[] = [
  { key: 'amber',    label: '暖橙', swatch: '#F59E0B' },
  { key: 'ocean',    label: '海蓝', swatch: '#3B82F6' },
  { key: 'mint',     label: '青葱', swatch: '#10B981' },
  { key: 'violet',   label: '薰衣草', swatch: '#8B5CF6' },
  { key: 'rose',     label: '粉樱', swatch: '#F43F5E' },
  { key: 'graphite', label: '石墨', swatch: '#64748B' },
]

export const DEFAULT_THEME_COLOR: ThemeColorKey = 'amber'
export const THEME_COLOR_STORAGE_KEY = 'jh-theme-color'
