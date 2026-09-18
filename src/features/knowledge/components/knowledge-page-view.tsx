import { BookOpenText, FileCode2, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DocumentUploadForm } from './document-upload-form'

export function KnowledgePageView() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">KNOWLEDGE BASE</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">知识库</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          将品牌规范、内容语调、选题准则等 Markdown 文档提交给 AI Agent，业务请求统一通过 /api/v1 处理。
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCode2 className="size-5 text-primary" />上传 Markdown
            </CardTitle>
          </CardHeader>
          <CardContent><DocumentUploadForm /></CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <BookOpenText className="size-5 text-primary" />
              <h2 className="mt-4 text-sm font-semibold">建议包含</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                <li>• 公众号定位与目标读者</li>
                <li>• 品牌语调和禁用表达</li>
                <li>• 内容栏目与发布规范</li>
                <li>• 审核流程与常用模板</li>
              </ul>
            </CardContent>
          </Card>
          <div className="flex items-start gap-3 rounded-2xl border bg-card/70 p-4 text-xs leading-5 text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            当前默认提交到 /api/v1/documents；如 Python 项目的路由不同，可通过环境变量调整。
          </div>
        </div>
      </div>
    </div>
  )
}
