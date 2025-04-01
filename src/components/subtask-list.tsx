'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SubtaskListProps {
  subtasks: { id: string; title: string; isCompleted: boolean }[]
  onAdd: (title: string) => void
  onToggleCompletion: (
    index: number,
    subTask: { title: string; isCompleted: boolean },
  ) => void
  onDelete: (index: number) => void
}

export function SubtaskList({
  subtasks,
  onAdd,
  onToggleCompletion,
  onDelete,
}: SubtaskListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      onAdd(newSubtaskTitle.trim())
      setNewSubtaskTitle('')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Adicione uma nova subtarefa"
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddSubtask()
            }
          }}
        />
        <Button
          onClick={handleAddSubtask}
          size="sm"
          disabled={!newSubtaskTitle.trim()}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {subtasks.length > 0 ? (
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
          {subtasks.map((subtask, index) => (
            <div
              key={subtask.id}
              className="flex items-center justify-between p-2 rounded-md bg-muted/50 group"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={subtask.isCompleted}
                  onCheckedChange={() =>
                    onToggleCompletion(index, {
                      isCompleted: subtask.isCompleted,
                      title: subtask.title,
                    })
                  }
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <span
                  className={cn(
                    'text-sm',
                    subtask.isCompleted && 'line-through text-muted-foreground',
                  )}
                >
                  {subtask.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(index)}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3 text-sm text-muted-foreground bg-muted/30 rounded-md">
          Nenhuma subtarefa criada. Adicione algumas.
        </div>
      )}
    </div>
  )
}
