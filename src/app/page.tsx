import { Category, SubTask, Task } from '@prisma/client'
import type { Metadata } from 'next'

import Dashboard from '@/components/dashboard'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Gerenciamento de Tarefas',
}

export interface ITask extends Task {
  subTasks: SubTask[]
  categories: Category[]
}

export default async function Home() {
  const tasks = await prisma.task.findMany({
    include: {
      subTasks: true,
      categories: true,
    },
  })

  const categories = await prisma.category.findMany({})

  return (
    <div className="min-h-screen">
      <Dashboard
        tasks={tasks.map((item) => ({
          ...item,
          subTasks: item?.subTasks ?? [],
        }))}
        categories={categories}
      />
    </div>
  )
}
