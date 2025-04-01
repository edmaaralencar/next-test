'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

export const toggleSubTaskCompletion = actionClient
  .schema(
    z.object({
      subTaskId: z.string(),
      isCompleted: z.boolean(),
    }),
  )
  .action(async ({ parsedInput: { isCompleted, subTaskId } }) => {
    await prisma.subTask.update({
      where: {
        id: subTaskId,
      },
      data: {
        isCompleted: !isCompleted,
      },
    })

    revalidatePath('/')

    return {
      message: 'Atividade atualizada com sucesso.',
    }
  })
