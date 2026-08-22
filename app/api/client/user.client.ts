import { LocalUser,DBUser } from "@/services/user.services"

export interface WeeklyUsersStats {
  totalUsers: number
  activeThisWeek: number
  activeNow: number
}

const USER_STORAGE_KEY = 'app_user'

// 📌 Función helper para convertir a ISO string
const toISOString = (date: string | Date | null | undefined): string => {
  if (!date) return new Date().toISOString()
  
  // Si ya es un string, devolverlo
  if (typeof date === 'string') return date
  
  // Si es un objeto Date, convertirlo
  if (date instanceof Date) return date.toISOString()
  
  return new Date().toISOString()
}

// 📌 Función helper para crear LocalUser desde DBUser
const mapDBUserToLocal = (dbUser: DBUser): LocalUser => {
  return {
    id: dbUser.id,
    name: dbUser.name || 'User',
    lastTimeConnected: toISOString(dbUser.lastTimeConnected)
  }
}

export const userService = {
  // Obtener usuario de localStorage
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

  // Guardar en localStorage
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
        console.error('❌ Error response:', errorData)
        throw new Error(errorData.error || 'Error al crear usuario')
      }

      const dbUser: DBUser = await response.json()
      
      const localUser = mapDBUserToLocal(dbUser)
      userService.saveLocalUser(localUser)
      
      console.log('✅ Usuario guardado en localStorage:', localUser)
      return localUser
      
    } catch (error) {
      console.error('❌ Error en createUser:', error)
      throw error
    }
  },

  // Inicializar usuario
// app/lib/services/client/user.service.ts
initUser: async (): Promise<LocalUser> => {
  // 1. Verificar si existe en localStorage
  const existing = userService.getLocalUser()
  
  // 2. Si existe, devolverlo
  if (existing) {
    console.log('👤 Usuario existente en localStorage:', existing.id)
    // Opcional: actualizar conexión
    try {
      await userService.updateLastConnected(existing.id)
    } catch (error) {
      console.warn('⚠️ Error al actualizar conexión:', error)
    }
    return existing
  }
  
  // 3. Si no existe, crear nuevo
  console.log('🆕 Creando nuevo usuario...')
  const newUser = await userService.createUser('User')
  console.log('✅ Usuario creado:', newUser.id)
  return newUser
},

  // Actualizar nombre
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

  // Actualizar última conexión
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
  console.log('📊 Estadísticas de usuarios:', data)
  
  return {
    totalUsers: data.totalUsers || 0,
    activeThisWeek: data.usersConnectedThisWeek || 0,
    activeNow: data.activeNow || 0
  }
},

  // Obtener estadísticas
  getStats: async () => {
    const response = await fetch('/api/users/stats')
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al obtener estadísticas')
    }
    return response.json()
  }
}