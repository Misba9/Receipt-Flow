import { Upload } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button, Card, CardDescription, CardTitle } from '@/components/ui'

export function ReceiptsPage() {
  return (
    <div>
      <PageHeader
        title="Receipts"
        description="Browse and manage your uploaded receipts."
        actions={
          <Button disabled>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        }
      />

      <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <CardTitle>No receipts yet</CardTitle>
        <CardDescription>
          Receipt list and filters will be implemented here.
        </CardDescription>
      </Card>
    </div>
  )
}
