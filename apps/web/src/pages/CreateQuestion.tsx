import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

export function CreateQuestion() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState<string>('GENERAL')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('Select a user first')
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
      const r = await api.createQuestion({ title, body, tags, category }, user.id)
      navigate(`/q/${r.data?.id ?? ''}`)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Ask a Question</CardTitle>
        {!user && (
          <p className="text-sm text-muted-foreground">Select a user from the dropdown to post.</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (5–120 chars)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief question title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body (20–5000 chars)</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe your question in detail..."
              rows={8}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagsAutocomplete value={tags} onChange={setTags} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting || !user}>
            {submitting ? 'Posting...' : 'Post Question'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
