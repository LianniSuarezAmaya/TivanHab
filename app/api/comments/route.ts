// app/api/comments/route.ts
import { NextResponse } from 'next/server'
import { commentService } from '@/services/comment.service'
export async function GET() {
  try {
    const comments = await commentService.getAll()
    return NextResponse.json(comments)
  } catch (error) {


    // Devuelve el error específico para debug
    return NextResponse.json(
      {
        error: 'Error al obtener comentarios',

      },
      { status: 500 }
    )
  }
}

// POST /api/comments
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.content || !body.userId) {
      return NextResponse.json(
        { error: 'content y userId son requeridos' },
        { status: 400 }
      )
    }

    const comment = await commentService.create({
      content: body.content,
      userId: body.userId
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error en POST /api/comments:', error)
    return NextResponse.json(
      { error: 'Error al crear comentario' },
      { status: 500 }
    )
  }
}