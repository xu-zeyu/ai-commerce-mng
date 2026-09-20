'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogContextValue {
  open: boolean
}

const DialogContext = React.createContext<DialogContextValue>({ open: false })

function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }, [controlledOpen, onOpenChange])

  return (
    <DialogContext.Provider value={{ open }}>
      <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange} {...props} />
    </DialogContext.Provider>
  )
}

const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    forceMount
    className={cn('pointer-events-auto fixed inset-0 bg-black/45 backdrop-blur-sm', className)}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

interface DialogContentProps extends Omit<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  'asChild' | 'forceMount'
> {
  /** 弹窗触发点，坐标相对于当前视口。 */
  originPoint?: { x: number; y: number } | null
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ children, className, originPoint, style, ...props }, ref) => {
  const { open } = React.useContext(DialogContext)
  const viewportCenter = typeof window === 'undefined'
    ? { x: 0, y: 0 }
    : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const closedTransform = {
    scale: originPoint ? 0.2 : 0.96,
    x: originPoint ? originPoint.x - viewportCenter.x : 0,
    y: originPoint ? originPoint.y - viewportCenter.y : 0,
  }

  return (
    <DialogPortal forceMount>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="dialog-presence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-none fixed inset-0 z-50"
          >
            <DialogOverlay />
            <DialogPrimitive.Content
              ref={ref}
              forceMount
              className="pointer-events-auto fixed left-1/2 top-1/2 z-10 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 outline-none"
              style={style}
              {...props}
            >
              <motion.div
                initial={closedTransform}
                animate={{
                  scale: 1,
                  x: 0,
                  y: 0,
                  transition: {
                    type: 'spring',
                    stiffness: 380,
                    damping: 32,
                    mass: 0.75,
                  },
                }}
                exit={{
                  ...closedTransform,
                  transition: {
                    duration: 0.2,
                    ease: [0.4, 0, 1, 1],
                  },
                }}
                className={cn(
                  'relative grid max-h-[90vh] w-full gap-4 overflow-y-auto rounded-3xl border bg-card p-6 shadow-xl',
                  className,
                )}
              >
                {children}
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <X className="size-4" />
                  <span className="sr-only">关闭</span>
                </DialogPrimitive.Close>
              </motion.div>
            </DialogPrimitive.Content>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold tracking-tight', className)} {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-sm leading-6 text-muted-foreground', className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
}
