import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando base de datos...')
  
  await prisma.user.createMany({
    data: [
      { email: 'admin@test.com', name: 'Admin' },
      { email: 'juan@test.com', name: 'Juan Pérez' },
      { email: 'maria@test.com', name: 'María García' },
    ],
    skipDuplicates: true
  })
  
  console.log('✅ Seed completado - 3 usuarios creados')
}

main()
  .catch(e => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })