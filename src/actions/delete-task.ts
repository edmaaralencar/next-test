'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

export const deleteTask = actionClient
  .schema(
    z.object({
      taskId: z.string(),
    }),
  )
  .action(async ({ parsedInput: { taskId } }) => {
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    })

    revalidatePath('/')

    return {
      message: 'Tarefa deletada com sucesso.',
    }
  })
