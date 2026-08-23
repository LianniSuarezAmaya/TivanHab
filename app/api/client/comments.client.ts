import type { CommentFrontend,CommentDB } from "@/hooks/useComments"

function transformComment(dbComment: CommentDB): CommentFrontend {
  return {
    id: dbComment.id,
    username: dbComment.user?.name || `Usuario ${dbComment.userId}`,
    message: dbComment.content,
    createdAt: dbComment.createdAt
  }
}

export const commentsService = {
    
  fetchComments: async (): Promise<CommentFrontend[]>=> {

    const response = await fetch('/api/comments')
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error al obtener comentarios')
    }

    const data = await response.json()

    return data.map(transformComment)
  },
  createComment:async(data: { 
    content: string; 
    userId: number 
  }): Promise<CommentDB>=> {

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: data.content,
          userId: data.userId
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear comentario')
      }
      
      const newComment = await response.json()
      return newComment
    } catch (error) {
      throw error
    }
  }
}