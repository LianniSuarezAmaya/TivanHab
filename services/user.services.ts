import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface LocalUser {
  id: number
  name: string
  lastTimeConnected: string
}

export interface DBUser {
  id: number
  name: string | null
  createdAt: Date
  lastTimeConnected: Date | null
}

export const userDbService = {

  createUser: async (id:number,name: string): Promise<DBUser> => {
    return prisma.user.create({
      data: {
        id:id,
        name: name || 'User',
        lastTimeConnected: new Date()
      }
    })
  },


  updateLastConnected: async (userId: number): Promise<DBUser> => {
    return prisma.user.update({
      where: { id: userId },
      data: {
        lastTimeConnected: new Date()
      }
    })
  },

  updateUserName: async (userId: number, name: string): Promise<DBUser> => {

    return prisma.user.update({
      where: { id: userId },
      data: { name }
    })
  },

  getAllUsers: async (): Promise<DBUser[]> => {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }
}
