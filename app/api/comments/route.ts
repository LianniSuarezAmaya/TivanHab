import { NextResponse } from 'next/server'
import { commentDbService } from '@/services/comment.service'

export async function GET() {
  try {
    const comments = await commentDbService.getAll()
    return NextResponse.json(comments)
  }catch(error){
    return NextResponse.json(
      {
        error: 'Error al obtener comentarios',

      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.content || !body.userId) {
      return NextResponse.json(
        { error: 'content y userId son requeridos' },
        { status: 400 }
      )
    }
    
    const comment = await commentDbService.create({
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