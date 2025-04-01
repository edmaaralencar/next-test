'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

export const createTask = actionClient
  .schema(
    z.object({
      title: z.string(),
      status: z.string(),
      priority: z.string(),
      description: z.string().nullable(),
      subTasks: z.array(
        z.object({ title: z.string(), isCompleted: z.boolean() }),
      ),
      categories: z.array(z.object({ categoryId: z.string() })),
    }),
  )
  .action(
    async ({
      parsedInput: {
        title,
        description,
        priority,
        status,
        subTasks,
        categories,
      },
    }) => {
      const task = await prisma.task.create({
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
            connect: categories.map((item) => ({
              id: item.categoryId,
            })),
          },
        },
      })

      revalidatePath('/')

      return {
        message: 'Atividade criada com sucesso.',
        data: {
          id: task.id,
        },
      }
    },
  )
