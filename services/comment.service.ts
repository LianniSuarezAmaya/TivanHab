
// app/services/comment.service.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const commentService = {
  // 📌 GET - Todos los comentarios con su usuario
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
      console.error('Error en getAll:', error)
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
              // ✅ Sin email
            }
          }
        }
      })
      return comment
    } catch (error) {
      console.error('Error en create:', error)
      throw error
    }
  }
}