// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { userDbService } from '@/services/user.services'

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    const users = await userDbService.getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error GET /api/users:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}

// 📌 Generar ID único combinando timestamp + random
const generateUniqueId = (): number => {
  // Timestamp en segundos (10 dígitos)
  const timestamp = Math.floor(Date.now() / 1000)
  
  // Número aleatorio de 4 dígitos (0-9999)
  const random = Math.floor(Math.random() * 10000)
  
  // Combinar: timestamp (10 dígitos) + random (4 dígitos) = 14 dígitos
  // Pero limitamos para no exceder INT máximo (2,147,483,647)
  const id = parseInt(`${timestamp.toString().slice(-6)}${String(random).padStart(4, '0')}`)
  
  return id
}

// POST - Crear usuario
// app/api/users/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('📥 POST body:', body)

    if (!body.name) {
      return NextResponse.json(
        { error: 'Nombre es requerido' },
        { status: 400 }
      )
    }

    console.log('📝 Creando usuario con nombre:', body.name)
    const user = await userDbService.createUser(generateUniqueId(),body.name)
    console.log('✅ Usuario creado:', user)
    
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('❌ Error POST /api/users:', error)
    
    // Devolver el error específico
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error al crear usuario',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      )
    }

    let user

    // Si se actualiza el nombre
    if (body.name) {
      user = await userDbService.updateUserName(body.id, body.name)
    }
    // Si se actualiza la conexión
    else if (body.lastTimeConnected) {
      user = await userDbService.updateLastConnected(body.id)
    } else {
      return NextResponse.json(
        { error: 'No hay datos para actualizar' },
        { status: 400 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error PUT /api/users:', error)
    
    // Si el usuario no existe
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    )
  }
}