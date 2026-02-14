import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const patientAlice = await prisma.user.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      display_name: 'Patient Alice',
      role: 'PATIENT',
      is_verified_doctor: false,
    },
  })
  const patientBob = await prisma.user.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      display_name: 'Patient Bob',
      role: 'PATIENT',
      is_verified_doctor: false,
    },
  })
  const drSmith = await prisma.user.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      display_name: 'Dr. Smith',
      role: 'DOCTOR',
      is_verified_doctor: true,
    },
  })
  const drUnverified = await prisma.user.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      display_name: 'Dr. Unverified',
      role: 'DOCTOR',
      is_verified_doctor: false,
    },
  })

  await prisma.question.upsert({
    where: { id: '10000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '10000000-0000-0000-0000-000000000001',
      author_id: patientAlice.id,
      title: 'Headache that won\'t go away - when to see a doctor?',
      body: 'I have had a persistent headache for the past three days. It\'s not severe but doesn\'t seem to improve with rest or over-the-counter pain relievers. Should I schedule an appointment?',
      tags: ['headache', 'general'],
      status: 'OPEN',
    },
  })

  console.log({ patientAlice, patientBob, drSmith, drUnverified })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
