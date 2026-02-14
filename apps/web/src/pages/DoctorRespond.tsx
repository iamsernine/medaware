import { useParams } from 'react-router-dom'
import { Thread } from './Thread'

export function DoctorRespond() {
  const { id } = useParams()
  return <Thread key={id} />
}
