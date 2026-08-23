import { describe, it, expect, vi, beforeEach } from 'vitest'
import { commentsService } from './comments.client'


describe('commentsService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('fetchComments', () => {
    it('should fetch and transform comments', async () => {
      const comments = [
        {
          id: 1,
          userId: 10,
          content: 'Hola mundo',
          createdAt: '2026-08-22T10:00:00.000Z',
          user: {
            name: 'Juan',
          },
        },
        {
          id: 2,
          userId: 20,
          content: 'Segundo comentario',
          createdAt: '2026-08-22T11:00:00.000Z',
          user: {
            name: 'Ana',
          },
        },
      ]

      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify(comments),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      )

      const result =
        await commentsService.fetchComments()

      expect(result).toEqual([
        {
          id: 1,
          username: 'Juan',
          message: 'Hola mundo',
          createdAt:
            '2026-08-22T10:00:00.000Z',
        },
        {
          id: 2,
          username: 'Ana',
          message: 'Segundo comentario',
          createdAt:
            '2026-08-22T11:00:00.000Z',
        },
      ])

      expect(fetch).toHaveBeenCalledWith(
        '/api/comments'
      )
    })

    it('should use the userId when the user has no name', async () => {
      const comments = [
        {
          id: 1,
          userId: 42,
          content: 'Comentario',
          createdAt:
            '2026-08-22T10:00:00.000Z',
          user: null,
        },
      ]

      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify(comments),
          { status: 200 }
        )
      )

      const result =
        await commentsService.fetchComments()

      expect(result).toEqual([
        {
          id: 1,
          username: 'Usuario 42',
          message: 'Comentario',
          createdAt:
            '2026-08-22T10:00:00.000Z',
        },
      ])
    })

    it('should throw the API error when the request fails', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({
            error: 'No autorizado',
          }),
          { status: 401 }
        )
      )

      await expect(
        commentsService.fetchComments()
      ).rejects.toThrow('No autorizado')
    })

    it('should use the default error when the API does not provide one', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({}),
          { status: 500 }
        )
      )

      await expect(
        commentsService.fetchComments()
      ).rejects.toThrow(
        'Error al obtener comentarios'
      )
    })
  })

  describe('createComment', () => {
    it('should create a comment with the correct request', async () => {
      const newComment = {
        id: 10,
        userId: 5,
        content: 'Nuevo comentario',
        createdAt:
          '2026-08-22T12:00:00.000Z',
        user: {
          name: 'Pedro',
        },
      }

      const fetchMock = vi
        .spyOn(global, 'fetch')
        .mockResolvedValue(
          new Response(
            JSON.stringify(newComment),
            { status: 201 }
          )
        )

      const result =
        await commentsService.createComment({
          content: 'Nuevo comentario',
          userId: 5,
        })

      expect(result).toEqual(newComment)

      expect(fetchMock).toHaveBeenCalledWith(
        '/api/comments',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            content: 'Nuevo comentario',
            userId: 5,
          }),
        }
      )
    })

    it('should throw the API error when creation fails', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({
            error: 'No se pudo crear el comentario',
          }),
          { status: 400 }
        )
      )

      await expect(
        commentsService.createComment({
          content: 'Comentario',
          userId: 5,
        })
      ).rejects.toThrow(
        'No se pudo crear el comentario'
      )
    })

    it('should use the default error when creation fails without an API error', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(
          JSON.stringify({}),
          { status: 500 }
        )
      )

      await expect(
        commentsService.createComment({
          content: 'Comentario',
          userId: 5,
        })
      ).rejects.toThrow(
        'Error al crear comentario'
      )
    })
  })
})