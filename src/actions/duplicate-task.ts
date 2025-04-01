'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

export const duplicateTask = actionClient
  .schema(
    z.object({
      taskIdToBeDuplicated: z.string(),
    }),
  )
  .action(async ({ parsedInput: { taskIdToBeDuplicated } }) => {
    const taskToBeDuplicated = await prisma.task.findUnique({
      where: {
        id: taskIdToBeDuplicated,
      },
      include: {
        subTasks: true,
      },
    })

    if (!taskToBeDuplicated) {
      return {
        message: 'Tarefa não existe.',
      }
    }

    await prisma.task.create({
      data: {
        title: taskToBeDuplicated.title,
        priority: taskToBeDuplicated.priority,
        status: taskToBeDuplicated.status,
        description: taskToBeDuplicated.description,
        subTasks: {
          createMany: {
            data: taskToBeDuplicated.subTasks.map((item) => ({
              isCompleted: item.isCompleted,
              title: item.title,
            })),
          },
        },
      },
    })

    revalidatePath('/')

    return {
      message: 'Tarefa duplicada com sucesso.',
    }
  })
