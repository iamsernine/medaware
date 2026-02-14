import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useUser } from '../context/UserContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Select } from '../components/ui/select'
import { TagsAutocomplete } from '../components/TagsAutocomplete'

const CATEGORIES = ['GENERAL', 'SYMPTOMS', 'MEDICATION', 'DIAGNOSIS', 'OTHER'] as const

export function EditQuestion() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState<string>('GENERAL')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.getQuestion(id)
      .then((r) => {
        const q = r.data
        setTitle(q.title)
        setBody(q.body)
        setTags(q.tags || [])
        setCategory(q.category ?? 'GENERAL')
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !id) return
    setSubmitting(true)
    setError(null)
    try {
      await api.updateQuestion(id, { title, body, tags, category }, user.id)
      navigate(`/q/${id}`)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading...</p>
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Edit Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-body">Body</Label>
            <Textarea
              id="edit-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagsAutocomplete value={tags} onChange={setTags} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(`/q/${id}`)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
