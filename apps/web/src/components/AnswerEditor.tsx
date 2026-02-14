import { useState } from 'react'
import { api } from '../api/client'

interface AnswerEditorProps {
  questionId?: string
  answer?: any
  currentUser: any
  onCreated?: () => void
  onUpdated?: () => void
}

export function AnswerEditor({ questionId, answer, currentUser, onCreated, onUpdated }: AnswerEditorProps) {
  const [body, setBody] = useState(answer?.body ?? '')
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isOwner = currentUser?.id === answer?.doctor_id

  const handleSubmit = async () => {
    if (!currentUser) return
    if (body.length < 20 || body.length > 5000) {
      alert('Body must be 20–5000 characters')
      return
    }
    setSubmitting(true)
    try {
      if (questionId) {
        await api.createAnswer(questionId, { body }, currentUser.id)
        setBody('')
        onCreated?.()
      } else if (answer) {
        await api.updateAnswer(answer.id, { body }, currentUser.id)
        setEditing(false)
        onUpdated?.()
      }
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!currentUser || !answer || !isOwner) return
    if (!confirm('Delete this answer?')) return
    setSubmitting(true)
    try {
      await api.deleteAnswer(answer.id, currentUser.id)
      onUpdated?.()
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (questionId) {
    return (
      <div style={{ marginTop: 24 }}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Your answer (20–5000 chars)"
          rows={5}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <button onClick={handleSubmit} disabled={submitting || body.length < 20}>Post Answer</button>
      </div>
    )
  }

  if (answer && isOwner) {
    if (editing) {
      return (
        <div style={{ marginTop: 8 }}>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
          <button onClick={handleSubmit} disabled={submitting}>Save</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      )
    }
    return (
      <div style={{ marginTop: 8, fontSize: 14 }}>
        <button onClick={() => setEditing(true)}>Edit</button>
        <button onClick={handleDelete} style={{ marginLeft: 8, color: '#f55' }}>Delete</button>
      </div>
    )
  }

  return null
}
