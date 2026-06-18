import type { ReactNode } from 'react'
import { SettingsSectionLayout } from '@/features/settings/components/settings-section-layout'

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <SettingsSectionLayout>{children}</SettingsSectionLayout>
}
