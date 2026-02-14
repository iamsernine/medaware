export type UserRole = 'PATIENT' | 'DOCTOR'
export type QuestionStatus = 'OPEN' | 'CLOSED'

export interface User {
  id: string
  display_name: string
  role: UserRole
  is_verified_doctor: boolean
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  author_id: string
  title: string
  body: string
  tags: string[]
  status: QuestionStatus
  created_at: string
  updated_at: string
}

export interface Answer {
  id: string
  question_id: string
  doctor_id: string
  body: string
  created_at: string
  updated_at: string
}
