'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

export const updateTask = actionClient
  .schema(
    z.object({
      taskId: z.string(),
      title: z.string(),
      status: z.string(),
      priority: z.string(),
      description: z.string().nullable(),
      subTasks: z.array(
        z.object({
          title: z.string(),
          isCompleted: z.boolean(),
        }),
      ),
      categories: z.array(z.object({ categoryId: z.string() })),
    }),
  )
  .action(
    async ({
      parsedInput: {
        taskId,
        title,
        description,
        priority,
        status,
        subTasks,
        categories,
      },
    }) => {
      const taskExists = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
        include: {
          categories: true,
        },
      })

      if (!taskExists) {
        return {
          message: 'Tarefa não existe.',
        }
      }

      await prisma.subTask.deleteMany({
        where: {
          taskId,
        },
      })

      const task = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          title,
          priority,
          status,
          description,
          subTasks: {
            createMany: {
              data: subTasks.map((item) => ({
                isCompleted: item.isCompleted,
                title: item.title,
              })),
            },
          },
          categories: {
            disconnect: taskExists.categories.map((item) => ({
              id: item.id,
            })),
            connect: categories.map((item) => ({
              id: item.categoryId,
            })),
          },
        },
      })

      revalidatePath('/')

      return {
        message: 'Tarefa atualizada com sucesso.',
        data: {
          id: task.id,
        },
      }
    },
  )
