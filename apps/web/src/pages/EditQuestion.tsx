import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useUser } from '../context/UserContext'

export function EditQuestion() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tagsStr, setTagsStr] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    api.getQuestion(id)
      .then((r) => {
        const q = r.data
        setTitle(q.title)
        setBody(q.body)
        setTagsStr((q.tags || []).join(', '))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !id) return
    const tags = tagsStr.split(/,\s*/).filter(Boolean).slice(0, 5)
    setSubmitting(true)
    try {
      await api.updateQuestion(id, { title, body, tags }, user.id)
      navigate(`/q/${id}`)
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Loading...</p>
  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Question</h2>
      <div style={{ marginBottom: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: 8 }} required />
      </div>
      <div style={{ marginBottom: 12 }}>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} style={{ width: '100%', padding: 8 }} required />
      </div>
      <div style={{ marginBottom: 12 }}>
        <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} style={{ width: '100%', padding: 8 }} />
      </div>
      <button type="submit" disabled={submitting}>Save</button>
      <button type="button" onClick={() => navigate(`/q/${id}`)} style={{ marginLeft: 8 }}>Cancel</button>
    </form>
  )
}
