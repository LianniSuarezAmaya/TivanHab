import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const allUsers = await prisma.user.findMany()
    
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    
    const usersThisWeek = await prisma.user.count({
      where: {
        lastTimeConnected: {
          gte: startOfWeek
        }
      }
    })
    
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    const activeNow = await prisma.user.count({
      where: {
        lastTimeConnected: {
          gte: fiveMinutesAgo
        }
      }
    })

    const response = {
      totalUsers: allUsers.length,
      usersConnectedThisWeek: usersThisWeek,  // ⚠️ IMPORTANTE: este nombre debe coincidir
      activeNow: activeNow
    }
    
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ Error en GET /api/users/stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}