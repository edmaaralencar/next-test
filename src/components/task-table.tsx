'use client'

import { SubTask } from '@prisma/client'
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Edit,
  Filter,
  ListChecks,
  ListTodo,
  MoreHorizontal,
  Plus,
  Star,
  Trash2,
} from 'lucide-react'
import { Fragment, useState } from 'react'
import { toast } from 'sonner'

import { deleteTask } from '@/actions/delete-task'
import { duplicateTask } from '@/actions/duplicate-task'
import { toggleTaskFavorite } from '@/actions/toggle-task-favorite'
import { TaskWithSubTask } from '@/app/page'
import { TaskDialog, TaskFormInput } from '@/components/task-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils'

import { SubTaskRow } from './sub-task-row'

interface TaskTableProps {
  tasks: TaskWithSubTask[]
}

export function TaskTable({ tasks }: TaskTableProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<
    (TaskFormInput & { id: string }) | null
  >(null)
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  function handleEdit(task: TaskWithSubTask) {
    setCurrentTask({
      description: task.description ?? '',
      priority: task.priority,
      status: task.status,
      subTasks: task.subTasks,
      title: task.title,
      id: task.id,
    })

    setIsCreateDialogOpen(true)
  }

  const filteredTasks =
    filter === 'favorites' ? tasks.filter((task) => task.isFavorited) : tasks

  const toggleExpand = (taskId: string) => {
    const newExpandedTasks = new Set(expandedTasks)
    if (newExpandedTasks.has(taskId)) {
      newExpandedTasks.delete(taskId)
    } else {
      newExpandedTasks.add(taskId)
    }
    setExpandedTasks(newExpandedTasks)
  }

  const getSubtaskCompletionStatus = (subtasks: SubTask[]) => {
    if (subtasks.length === 0) return null

    const completedCount = subtasks.filter(
      (subtask) => subtask.isCompleted,
    ).length

    return `${completedCount}/${subtasks.length}`
  }

  async function onToggleFavorite(taskId: string, isFavorited: boolean) {
    toast.promise(
      async () =>
        await toggleTaskFavorite({
          isFavorited,
          taskId,
        }),
      {
        loading: 'Carregando...',
        success: (data) => {
          return data?.data?.message
        },
        error: 'Ocorreu um erro',
      },
    )
  }

  async function onDeleteTask(taskId: string) {
    toast.promise(async () => await deleteTask({ taskId }), {
      loading: 'Carregando...',
      success: (data) => {
        return data?.data?.message
      },
      error: 'Ocorreu um erro',
    })
  }

  async function onDuplicateTask(taskId: string) {
    toast.promise(
      async () => await duplicateTask({ taskIdToBeDuplicated: taskId }),
      {
        loading: 'Carregando...',
        success: (data) => {
          return data?.data?.message
        },
        error: 'Ocorreu um erro',
      },
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="flex items-center gap-2"
            size="sm"
          >
            <Filter className="h-4 w-4" />
            Todas as Atividades
          </Button>
          <Button
            variant={filter === 'favorites' ? 'default' : 'outline'}
            onClick={() => setFilter('favorites')}
            className="flex items-center gap-2"
            size="sm"
          >
            <Star className="h-4 w-4" />
            Favoritas
          </Button>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" /> Adicionar Atividade
        </Button>
      </div>

      <Card className="overflow-hidden py-0 border-border/40 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead className="min-w-[150px]">Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Subtarefas</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ListTodo className="h-8 w-8 text-muted-foreground/50" />
                      <p>
                        Nenhuma atividade encontrada. Crie sua primeira
                        atividade!
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="mt-2"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Tarefa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <Fragment key={task.id}>
                    <TableRow className="transition-colors">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            onToggleFavorite(task.id, task.isFavorited)
                          }
                          className="transition-all"
                        >
                          <Star
                            className={`h-4 w-4 transition-all ${task.isFavorited ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground group-hover:text-yellow-400/70'}`}
                          />
                        </Button>
                      </TableCell>
                      <TableCell>
                        {task.subTasks.length > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleExpand(task.id)}
                            className="h-6 w-6"
                          >
                            {expandedTasks.has(task.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="font-medium cursor-pointer">
                        {task.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(task.status)} transition-all`}
                        >
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getPriorityColor(task.priority)} transition-all`}
                        >
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.subTasks.length > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <ListChecks className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {getSubtaskCompletionStatus(task.subTasks)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Nenhuma
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(task.createdAt.toISOString())}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(task)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDuplicateTask(task.id)}
                            >
                              <Copy className="mr-2 h-4 w-4" /> Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => await onDeleteTask(task.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Deletar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                    {expandedTasks.has(task.id) &&
                      task.subTasks.map((subtask) => (
                        <SubTaskRow
                          key={subtask.id}
                          id={subtask.id}
                          isCompleted={subtask.isCompleted}
                          title={subtask.title}
                        />
                      ))}
                  </Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        defaultValues={currentTask || null}
        setCurrentTask={setCurrentTask}
      />
    </div>
  )
}
