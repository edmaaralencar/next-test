'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@prisma/client'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Flame,
  ListChecks,
  ListTodo,
  Loader2,
  Tag,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createTask } from '@/actions/create-task'
import { updateTask } from '@/actions/update-task'
import { SubtaskList } from '@/components/subtask-list'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { Badge } from './ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

const formSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório' }),
  description: z.string(),
  status: z.string({
    required_error: 'Status é obrigatório',
  }),
  priority: z.string({
    message: 'Prioridade é obrigatório',
  }),
  subTasks: z.array(z.object({ title: z.string(), isCompleted: z.boolean() })),
  categories: z.array(z.object({ categoryId: z.string() })),
})

export type TaskFormInput = z.infer<typeof formSchema>

interface TaskDialogProps {
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues: (TaskFormInput & { id: string }) | null
  setCurrentTask: (value: (TaskFormInput & { id: string }) | null) => void
}

export function TaskDialog({
  open,
  onOpenChange,
  defaultValues,
  setCurrentTask,
  categories,
}: TaskDialogProps) {
  const [labelPopoverOpen, setLabelPopoverOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormInput>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        description: defaultValues.description,
        priority: defaultValues.priority,
        status: defaultValues.status,
        subTasks: defaultValues.subTasks.map((item) => ({
          isCompleted: item.isCompleted,
          title: item.title,
        })),
        title: defaultValues.title,
        categories: defaultValues.categories,
      })
    }
  }, [defaultValues, reset])

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'subTasks',
  })

  const {
    fields: fieldsCategories,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: 'categories',
  })

  async function onSubmit(values: TaskFormInput) {
    if (defaultValues) {
      const res = await updateTask({
        title: values.title,
        status: values.status,
        priority: values.priority,
        description: values.description,
        subTasks: values.subTasks,
        taskId: defaultValues.id,
        categories: values.categories,
      })

      if (res?.data?.message) {
        toast.success(res?.data?.message)
      }

      onOpenChange(false)
      reset()
      setCurrentTask(null)
      return
    }

    const res = await createTask({
      title: values.title,
      status: values.status,
      priority: values.priority,
      description: values.description,
      subTasks: values.subTasks,
      categories: values.categories,
    })

    if (res?.data?.message) {
      toast.success(res?.data?.message)
    }

    reset()
    onOpenChange(false)
  }

  function handleAddSubtask(title: string) {
    append({ title, isCompleted: false })
  }

  function handleDeleteSubtask(index: number) {
    remove(index)
  }

  function handleToggleSubtaskCompletion(
    index: number,
    subTask: { title: string; isCompleted: boolean },
  ) {
    update(index, { title: subTask.title, isCompleted: !subTask.isCompleted })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {defaultValues ? 'Editar Tarefa' : 'Criar Nova Atividade'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Título
              </Label>
              <Input
                id="title"
                placeholder="Digite o título da tarefa"
                className="transition-all focus-visible:ring-offset-2"
                {...register('title')}
              />
              {errors.title?.message && (
                <span className="text-red-500 text-sm">
                  {errors.title?.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição
              </Label>
              <Textarea
                id="description"
                placeholder="Digite a descrição da tarefa"
                rows={3}
                className="resize-none transition-all focus-visible:ring-offset-2"
                {...register('description')}
              />
              {errors.description?.message && (
                <span className="text-red-500 text-sm">
                  {errors.description?.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="status"
                        className="transition-all focus:ring-offset-2 w-full"
                      >
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="Para Fazer"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <ListTodo className="h-4 w-4 text-orange-500" />
                            <span>Para Fazer</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="Em Progresso"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>Em Progresso</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="Completo"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Completo</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status?.message && (
                  <span className="text-red-500 text-sm">
                    {errors.status?.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Prioridade
                </Label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="priority"
                        className="transition-all focus:ring-offset-2 w-full"
                      >
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="Alta"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-red-500" />
                            <span>Alta</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="Média"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>Média</span>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="Baixa"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-emerald-500" />
                            <span>Baixa</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priority?.message && (
                  <span className="text-red-500 text-sm">
                    {errors.priority?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-2 mt-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Categorias
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {fieldsCategories.length > 0 ? (
                  fieldsCategories.map((category, index) => (
                    <Badge
                      key={category.categoryId}
                      className="flex items-center gap-1 px-2 py-1"
                      style={{
                        backgroundColor: categories.find(
                          (item) => item.id === category.categoryId,
                        )?.color,
                        color: '#fff',
                      }}
                    >
                      {
                        categories.find(
                          (item) => item.id === category.categoryId,
                        )?.name
                      }
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 text-white hover:bg-transparent hover:text-white/80"
                        onClick={() => removeCategory(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Nenhuma categoria atribuída
                  </div>
                )}
              </div>
              <Popover
                open={labelPopoverOpen}
                onOpenChange={setLabelPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Tag className="mr-2 h-4 w-4" />
                    Adicionar Categoria
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start" side="bottom">
                  <Command>
                    <CommandInput placeholder="Procure categoria..." />
                    <CommandList>
                      <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category, index) => (
                          <CommandItem
                            key={category.id}
                            onSelect={() =>
                              fieldsCategories.find(
                                (item) => item.id === category.id,
                              )
                                ? removeCategory(index)
                                : appendCategory({ categoryId: category.id })
                            }
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2 mt-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  Subtarefas
                </Label>
              </div>
              <SubtaskList
                subtasks={fields}
                onAdd={handleAddSubtask}
                onDelete={handleDeleteSubtask}
                onToggleCompletion={handleToggleSubtaskCompletion}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="transition-all"
            >
              Cancelar
            </Button>
            <Button type="submit" className="transition-all">
              {isSubmitting && <Loader2 className="animate-spin" />}
              {defaultValues ? 'Salvar alterações' : 'Criar Atividade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
