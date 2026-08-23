import { LocalUser,DBUser } from "@/services/user.services"

export interface WeeklyUsersStats {
  totalUsers: number
  activeThisWeek: number
  activeNow: number
}

const USER_STORAGE_KEY = 'app_user'

const toISOString = (date: string | Date | null | undefined): string => {
  if (!date) return new Date().toISOString()
  
  if (typeof date === 'string') return date
  
  if (date instanceof Date) return date.toISOString()
  
  return new Date().toISOString()
}

const mapDBUserToLocal = (dbUser: DBUser): LocalUser => {
  return {
    id: dbUser.id,
    name: dbUser.name || 'User',
    lastTimeConnected: toISOString(dbUser.lastTimeConnected)
  }
}

export const userService = {

  getLocalUser: (): LocalUser | null => {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY)
      if (!stored) return null
      return JSON.parse(stored) as LocalUser
    } catch {
      return null
    }
  },

  saveLocalUser: (user: LocalUser): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  },


  createUser: async (name: string): Promise<LocalUser> => {
    try {

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'User' })
      })


      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear usuario')
      }

      const dbUser: DBUser = await response.json()
      
      const localUser = mapDBUserToLocal(dbUser)
      userService.saveLocalUser(localUser)
      
      return localUser
      
    } catch (error) {
      throw error
    }
  },


  initUser: async (): Promise<LocalUser> => {
    
    const existing = userService.getLocalUser()
    
    if (existing) {
      try {
        await userService.updateLastConnected(existing.id)
      } catch (error) {
        console.warn('⚠️ Error al actualizar conexión:', error)
      }
      return existing
    }
    
    const newUser = await userService.createUser('User')
    return newUser
  },

  updateUserName: async (userId: number, name: string): Promise<LocalUser> => {
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, name })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al actualizar nombre')
    }

    const dbUser: DBUser = await response.json()
    const localUser = mapDBUserToLocal(dbUser)
    
    userService.saveLocalUser(localUser)
    return localUser
  },

  updateLastConnected: async (userId: number): Promise<LocalUser> => {
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: userId, 
        lastTimeConnected: new Date().toISOString() 
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al actualizar conexión')
    }

    const dbUser: DBUser = await response.json()
    const localUser = mapDBUserToLocal(dbUser)
    
    userService.saveLocalUser(localUser)
    return localUser
  },

  fetchWeeklyUsers:async(): Promise<WeeklyUsersStats>=> {
    const response = await fetch('/api/users/stats')
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al obtener estadísticas')
    }
    
    const data = await response.json()
    
    return {
      totalUsers: data.totalUsers || 0,
      activeThisWeek: data.usersConnectedThisWeek || 0,
      activeNow: data.activeNow || 0
    }
  },

  getStats: async () => {
    const response = await fetch('/api/users/stats')
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al obtener estadísticas')
    }
    return response.json()
  }
}