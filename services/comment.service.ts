import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const commentDbService = {
  
  getAll: async () => {
    try {
      const comments = await prisma.comment.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return comments
    } catch (error) {
      throw error
    }
  },

  create: async (data: { content: string; userId: number }) => {
    try {
      const comment = await prisma.comment.create({
        data: {
          content: data.content,
          userId: data.userId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
      return comment
    } catch (error) {
      throw error
    }
  }
}