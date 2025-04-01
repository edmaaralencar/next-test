'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

export const updateCategory = actionClient
  .schema(
    z.object({
      id: z.string(),
      name: z.string(),
      color: z.string(),
    }),
  )
  .action(async ({ parsedInput: { color, name, id } }) => {
    const categoryExists = await prisma.category.findUnique({
      where: {
        id,
      },
    })

    if (!categoryExists) {
      return {
        message: 'Categoria não existe.',
      }
    }

    await prisma.category.update({
      where: {
        id,
      },
      data: {
        color,
        name,
      },
    })

    revalidatePath('/')

    return {
      message: 'Categoria criada com sucesso.',
    }
  })
