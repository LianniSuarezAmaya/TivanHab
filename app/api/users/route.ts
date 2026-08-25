import { NextResponse } from 'next/server'
import { userDbService } from '@/services/user.services'
{/*export async function GET() {
  try {
    const users = await userDbService.getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }

}
  

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        { error: 'Nombre es requerido' },
        { status: 400 }
      )
    }

    const user = await userDbService.createUser(generateUniqueId(),body.name)
    
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    
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
  */}



export async function GET() {
  console.log('🔍 [GET /api/users] Iniciando petición...')
  
  try {
    console.log('📡 [GET /api/users] Llamando a userDbService.getAllUsers()...')
    const users = await userDbService.getAllUsers()
    
    console.log('✅ [GET /api/users] Usuarios obtenidos exitosamente:', {
      cantidad: users?.length || 0,
      primeros: users?.slice(0, 2) // Muestra los primeros 2 para no saturar
    })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('❌ [GET /api/users] Error al obtener usuarios:', {
      mensaje: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : 'No stack disponible',
      error: error
    })
    
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}


const generateUniqueId = (): number => {

  const timestamp = Math.floor(Date.now() / 1000)
  
  const random = Math.floor(Math.random() * 10000)
  
  const id = parseInt(`${timestamp.toString().slice(-6)}${String(random).padStart(4, '0')}`)
  
  return id
}


export async function POST(request: Request) {
  console.log('🔍 [POST /api/users] Iniciando petición...')
  
  try {
    console.log('📦 [POST /api/users] Leyendo body...')
    const body = await request.json()
    console.log('📝 [POST /api/users] Body recibido:', body)

    if (!body.name) {
      console.warn('⚠️ [POST /api/users] Nombre no proporcionado')
      return NextResponse.json(
        { error: 'Nombre es requerido' },
        { status: 400 }
      )
    }
    
    const user = await userDbService.createUser(body.name)
    
    console.log(`✅ [POST /api/users] Usuario creado exitosamente:`, user)
    
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('❌ [POST /api/users] Error capturado:', {
      mensaje: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : 'No stack disponible',
      error: error
    })
    
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

    if (body.name) {
      user = await userDbService.updateUserName(body.id, body.name)
    }
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