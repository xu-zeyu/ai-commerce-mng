'use client'

import { useRouter } from 'next/navigation'
import { Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Breadcrumb } from './breadcrumb'
import { useAuthStore } from '@/stores/use-auth-store'

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const initials = user?.userName?.slice(0, 2) ?? '管'

  return (
    <div className="flex flex-1 items-center justify-between gap-4">
      <Breadcrumb />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="切换主题"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-2xl px-2 py-1 transition-colors hover:bg-accent">
            <Avatar className="size-8">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user?.userName ?? '头像'} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block">
              <div className="text-sm font-medium leading-none">
                {user?.userName ?? '管理员'}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                平台管理员
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 size-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
