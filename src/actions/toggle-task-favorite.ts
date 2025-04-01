'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

export const toggleTaskFavorite = actionClient
  .schema(
    z.object({
      taskId: z.string(),
      isFavorited: z.boolean(),
    }),
  )
  .action(async ({ parsedInput: { taskId, isFavorited } }) => {
    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        isFavorited: !isFavorited,
      },
    })

    revalidatePath('/')

    return {
      message: isFavorited
        ? 'Tarefa desfavoritada com sucesso.'
        : 'Tarefa favoritada com sucesso.',
    }
  })
