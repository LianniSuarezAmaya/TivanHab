import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsService } from '@/app/api/client/comments.client'

export interface CommentFrontend {
  id: number
  username: string
  message: string
  createdAt: string
}

export interface CommentDB {
  id: number
  content: string
  userId: number
  createdAt: string
  user?: {
    id: number
    name: string | null
  }
}



export function useComments() {
  return useQuery<CommentFrontend[]>({
    queryKey: ['comments'],
    queryFn: ()=>commentsService.fetchComments(),
  })
}


export function useCreateComment() {
  const queryClient = useQueryClient()
  
  return useMutation<CommentDB, Error, { content: string; userId: number }>({
    mutationFn: commentsService.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
    onError: (error) => {
      console.error('❌ Error al crear comentario:', error)
    }
  })
}