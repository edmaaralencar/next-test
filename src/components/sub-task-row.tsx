import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { deleteSubTask } from '@/actions/delete-sub-task'
import { toggleSubTaskCompletion } from '@/actions/toggle-sub-task-completion'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { TableCell, TableRow } from './ui/table'

type SubTaskRowProps = {
  id: string
  isCompleted: boolean
  title: string
}

export function SubTaskRow({ id, isCompleted, title }: SubTaskRowProps) {
  async function onCompleteSubTask() {
    const res = await toggleSubTaskCompletion({
      isCompleted,
      subTaskId: id,
    })

    if (res?.data?.message) {
      toast.success(res.data.message)
    }
  }

  async function onDeleteSubTask() {
    const res = await deleteSubTask({
      subTaskId: id,
    })

    if (res?.data?.message) {
      toast.success(res.data.message)
    }
  }

  return (
    <TableRow className="bg-muted/30 hover:bg-muted/40 transition-colors">
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={async () => await onCompleteSubTask()}
            className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
          <span
            className={cn(
              'text-sm',
              isCompleted && 'line-through text-primary',
            )}
          >
            {title}
          </span>
        </div>
      </TableCell>
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell />
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onDeleteSubTask()}
        >
          <Trash2 className="h-3 w-3 text-muted-foreground" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
