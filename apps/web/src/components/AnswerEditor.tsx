import { useState } from 'react'
import { api } from '../api/client'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

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
      <div className="mt-6 space-y-3">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Your answer (20–5000 chars)"
          rows={5}
          className="min-h-[120px]"
        />
        <Button onClick={handleSubmit} disabled={submitting || body.length < 20}>
          {submitting ? 'Posting...' : 'Post Answer'}
        </Button>
      </div>
    )
  }

  if (answer && isOwner) {
    if (editing) {
      return (
        <div className="mt-2 space-y-2">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )
    }
    return (
      <div className="mt-2 flex gap-2 text-sm">
        <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    )
  }

  return null
}
