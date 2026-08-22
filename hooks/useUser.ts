'use client'
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query'
import { userService,type WeeklyUsersStats } from '@/app/api/client/user.client'
import { LocalUser } from '@/services/user.services'


export function useUser() {

  const queryClient=useQueryClient()

  const initUser= useQuery<LocalUser, Error, { name: string; id: number,lastTimeConnected:string }>({
    queryFn:()=>userService.initUser(),
    queryKey:['user'],
    staleTime: 1000*60*10, 
  })
  
  const updateName=useMutation({
    mutationFn:(name:string)=>{
      const user=userService.getLocalUser()
      if (!user) throw new Error('Usuario no inicializado')
      return userService.updateUserName(user.id,name)},
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['user']})
    }
  })

  const updateConnection= useMutation<LocalUser,Error, { name: string; id: number,lastTimeConnected:string }>({
    mutationFn:()=>{
      const user=userService.getLocalUser()
      if (!user) throw new Error('Usuario no inicializado')
      return userService.updateLastConnected(user.id)},
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['user']})
      queryClient.invalidateQueries({queryKey:['stats']})
    }
  })

  const useWeeklyUsers= useQuery<WeeklyUsersStats>({
    queryKey: ['stats'],
    queryFn:()=> userService.fetchWeeklyUsers(),
    refetchInterval: 60000, // Actualizar cada minuto
    staleTime: 1000*60*5, // Los datos son stale después de 30 segundos
  })

  return {
    user:initUser.data,
    stats:useWeeklyUsers.data,
    useWeeklyUsers,
    initUser:initUser,
    updateName:updateName,
    updateConnection:updateConnection,
  }

}