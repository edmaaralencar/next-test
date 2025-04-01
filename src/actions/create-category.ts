'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action'

export const createCategory = actionClient
  .schema(
    z.object({
      name: z.string(),
      color: z.string(),
    }),
  )
  .action(async ({ parsedInput: { color, name } }) => {
    await prisma.category.create({
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
