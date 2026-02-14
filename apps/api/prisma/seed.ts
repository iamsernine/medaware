import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const FIXED_TAGS = [
  'headache', 'general', 'fever', 'cough', 'fatigue', 'nausea', 'dizziness', 'pain', 'rash', 'anxiety',
  'depression', 'insomnia', 'allergy', 'asthma', 'diabetes', 'hypertension', 'migraine', 'back-pain', 'joint-pain', 'chest-pain',
  'abdominal-pain', 'ear-pain', 'sore-throat', 'runny-nose', 'congestion', 'shortness-of-breath', 'heartburn', 'constipation', 'diarrhea', 'vomiting',
  'weight-loss', 'weight-gain', 'loss-of-appetite', 'swelling', 'bruising', 'itching', 'hives', 'blurred-vision', 'dry-eyes', 'red-eyes',
  'ear-ringing', 'hearing-loss', 'nosebleed', 'bleeding-gums', 'mouth-sores', 'difficulty-swallowing', 'muscle-weakness', 'numbness', 'tremors', 'seizures',
  'confusion', 'memory-loss', 'concentration', 'mood-changes', 'irritability', 'stress', 'panic', 'phobia', 'obsessive', 'ptsd',
  'arthritis', 'osteoporosis', 'fracture', 'sprain', 'tendinitis', 'carpal-tunnel', 'sciatica', 'neck-pain', 'knee-pain', 'foot-pain',
  'heart-palpitations', 'high-cholesterol', 'thyroid', 'anemia', 'vitamin-d', 'vitamin-b12', 'iron-deficiency', 'kidney', 'bladder', 'uti',
  'skin-infection', 'fungal', 'acne', 'eczema', 'psoriasis', 'dermatitis', 'sunburn', 'cold-sore', 'shingles', 'warts',
  'medication', 'side-effects', 'dosage', 'interaction', 'pregnancy', 'breastfeeding', 'pediatric', 'elderly', 'chronic', 'acute',
]

async function main() {
  for (const name of FIXED_TAGS) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

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
      tags: ['headache', 'general'], // must be in FIXED_TAGS
      category: 'SYMPTOMS',
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
