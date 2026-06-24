import { Inbox } from 'lucide-react'

export function DataTableEmpty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Inbox className="size-10 text-muted-foreground/30" />
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
