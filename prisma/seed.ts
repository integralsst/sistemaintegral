import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const adminEmail = 'admin@sisriesgos.com'
  const hashedPassword = await bcrypt.hash('Sis2026.,', 10)

  const admin = await prisma.user.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      name: 'Administrador SIS',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      name: 'Administrador SIS',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('Base de datos sembrada con éxito.')
  console.log('Administrador creado o actualizado:', admin.email)
}

main()
  .catch((error) => {
    console.error('Error en el seed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })