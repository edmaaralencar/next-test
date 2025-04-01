'use client'

import { LayoutDashboard, ListTodo } from 'lucide-react'

import { TaskWithSubTask } from '@/app/page'
import { Analytics } from '@/components/analytics'
import { TaskTable } from '@/components/task-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type DashboardProps = {
  tasks: TaskWithSubTask[]
}

export default function Dashboard({ tasks }: DashboardProps) {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8 max-w-7xl">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciamento de Tarefas
        </h1>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            <span>Tarefas</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-6">
          <TaskTable tasks={tasks} />
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <Analytics tasks={tasks} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
