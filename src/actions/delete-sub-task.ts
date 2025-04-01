'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

export const deleteSubTask = actionClient
  .schema(
    z.object({
      subTaskId: z.string(),
    }),
  )
  .action(async ({ parsedInput: { subTaskId } }) => {
    await prisma.subTask.delete({
      where: {
        id: subTaskId,
      },
    })

    revalidatePath('/')

    return {
      message: 'Subtarefa deletada com sucesso.',
    }
  })
