'use client'

import { Category } from '@prisma/client'
import { LayoutDashboard, ListTodo, Tag } from 'lucide-react'

import { ITask } from '@/app/page'
import { Analytics } from '@/components/analytics'
import { TaskTable } from '@/components/task-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { CategoryManager } from './category-manager'

type DashboardProps = {
  tasks: ITask[]
  categories: Category[]
}

export default function Dashboard({ tasks, categories }: DashboardProps) {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8 max-w-7xl">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciamento de Tarefas
        </h1>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            <span>Tarefas</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Categorias</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-6">
          <TaskTable tasks={tasks} categories={categories} />
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <Analytics tasks={tasks} />
        </TabsContent>
        <TabsContent value="categories" className="mt-6">
          <CategoryManager categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
