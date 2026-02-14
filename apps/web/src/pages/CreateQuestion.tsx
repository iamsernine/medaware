import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useUser } from '../context/UserContext'

export function CreateQuestion() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tagsStr, setTagsStr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tags = tagsStr.split(/,\s*/).filter(Boolean).slice(0, 5)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Select a user first')
      return
    }
    if (user.role !== 'PATIENT') {
      alert('Only patients can post questions')
      return
    }
    if (title.length < 5 || title.length > 120) {
      setError('Title must be 5–120 characters')
      return
    }
    if (body.length < 20 || body.length > 5000) {
      setError('Body must be 20–5000 characters')
      return
    }
    if (tags.length > 5) {
      setError('Maximum 5 tags')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const r = await api.createQuestion({ title, body, tags }, user.id)
      navigate(`/q/${r.data?.id ?? ''}`)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Ask a Question</h2>
      {!user && <p>Select a patient user from the dropdown to post.</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Title (5–120 chars)</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 8 }} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Body (20–5000 chars)</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} style={{ width: '100%', padding: 8 }} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Tags (comma-separated, max 5)</label>
          <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="headache, general" style={{ width: '100%', padding: 8 }} />
        </div>
        {error && <p style={{ color: '#f55' }}>{error}</p>}
        <button type="submit" disabled={submitting || !user}>Post Question</button>
      </form>
    </div>
  )
}
