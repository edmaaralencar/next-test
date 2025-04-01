'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

export const deleteCategory = actionClient
  .schema(
    z.object({
      categoryId: z.string(),
    }),
  )
  .action(async ({ parsedInput: { categoryId } }) => {
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    })

    revalidatePath('/')

    return {
      message: 'Tarefa deletada com sucesso.',
    }
  })
