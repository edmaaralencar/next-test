import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@prisma/client'
import { FormInput, Loader2, Pencil, Plus, Tag, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { createCategory } from '@/actions/create-category'
import { deleteCategory } from '@/actions/delete-category'
import { updateCategory } from '@/actions/update-category'

import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

type CategoryManagerProps = {
  categories: Category[]
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  color: z.string().min(1, { message: 'Cor é obrigatória' }),
})

type FormInput = z.infer<typeof formSchema>

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (currentCategory) {
      reset({
        color: currentCategory.color,
        name: currentCategory.name,
      })
    }
  }, [currentCategory, reset])

  async function onSubmit(values: FormInput) {
    if (currentCategory) {
      const res = await updateCategory({
        id: currentCategory.id,
        color: values.color,
        name: values.name,
      })

      if (res?.data?.message) {
        toast.success(res.data.message)

        setIsModalOpen(false)
        reset()
      }
      return
    }

    const res = await createCategory({
      color: values.color,
      name: values.name,
    })

    if (res?.data?.message) {
      toast.success(res.data.message)

      setIsModalOpen(false)
      reset()
    }
  }

  const predefinedColors = [
    '#ef4444', //
    '#f97316',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#6b7280',
  ]

  async function onDeleteCategory(categoryId: string) {
    toast.promise(async () => await deleteCategory({ categoryId }), {
      loading: 'Carregando...',
      success: (data) => {
        return data?.data?.message
      },
      error: 'Ocorreu um erro',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Categorias</h2>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" /> Adicionar Categoria
        </Button>
      </div>

      <Card className="border-border/40 shadow-sm py-0">
        <CardContent className="p-4">
          {categories.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <div className="flex flex-col items-center justify-center gap-2">
                <Tag className="h-8 w-8 text-muted-foreground/50" />
                <p>Nenhuma categoria criada.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4" /> Adicionar Categoria
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 rounded-md border border-border/60 group hover:border-border transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setIsModalOpen(true)
                        setCurrentCategory({
                          color: category.color,
                          id: category.id,
                          name: category.name,
                        })
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={async () => {
                        await onDeleteCategory(category.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {currentCategory ? 'Editar Categoria' : 'Criar Categoria'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nome
                </Label>
                <Input
                  id="name"
                  placeholder="Digite o nome da categoria"
                  className="transition-all focus-visible:ring-offset-2"
                  {...register('name')}
                />
                {errors.name?.message && (
                  <span className="text-sm text-red-500">
                    {errors.name?.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Cor</Label>
                <div className="flex flex-wrap gap-2">
                  <Controller
                    control={control}
                    name="color"
                    render={({ field }) => (
                      <>
                        {predefinedColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full transition-all ${
                              field.value === color
                                ? 'ring-2 ring-offset-2 ring-primary'
                                : ''
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => field.onChange(color)}
                          />
                        ))}
                      </>
                    )}
                  />
                </div>
                {errors.color?.message && (
                  <span className="text-sm text-red-500">
                    {errors.color?.message}
                  </span>
                )}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="transition-all"
              >
                Cancelar
              </Button>
              <Button type="submit" className="transition-all">
                {isSubmitting && <Loader2 className="animate-spin" />}
                {currentCategory ? 'Salvar Alterações' : 'Criar Categoria'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
