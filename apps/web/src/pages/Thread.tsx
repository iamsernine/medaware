import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client'
import { useUser } from '../context/UserContext'
import { AnswerEditor } from '../components/AnswerEditor'
import { VoteButton } from '../components/VoteButton'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export function Thread() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const [question, setQuestion] = useState<any>(null)
  const [similar, setSimilar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.getQuestion(id, user?.id).then((r) => setQuestion(r.data)).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [id, user?.id])

  useEffect(() => {
    if (!id) return
    api.getSimilarQuestions(id, 5).then((r) => setSimilar(r.data || [])).catch(() => setSimilar([]))
  }, [id])

  const refresh = () => {
    if (!id) return
    api.getQuestion(id, user?.id).then((r) => setQuestion(r.data))
  }

  const canAnswer = !!user && question?.status === 'OPEN'
  const isAuthor = user?.id === question?.author_id
  const canEditQuestion = isAuthor
  const canCloseQuestion = question?.status === 'OPEN' && user?.id === question?.author_id

  const handleCloseQuestion = async () => {
    if (!user || !question || !canCloseQuestion) return
    if (!confirm('Close this question? No new answers will be accepted.')) return
    try {
      await api.updateQuestion(question.id, { status: 'CLOSED' }, user.id)
      refresh()
    } catch (e) {
      alert((e as Error).message)
    }
  }

  const handleDeleteQuestion = async () => {
    if (!user || !question || !isAuthor) return
    if (!confirm('Delete this question?')) return
    try {
      await api.deleteQuestion(question.id, user.id)
      navigate('/')
    } catch (e) {
      alert((e as Error).message)
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading...</p>
  if (error) return <p className="text-destructive">Error: {error}</p>
  if (!question) return <p className="text-muted-foreground">Question not found.</p>

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="flex gap-4 p-6">
          <div className="flex-shrink-0 pt-0.5">
            <VoteButton
              voteCount={question.voteCount ?? 0}
              hasVoted={question.hasVoted}
              onVote={async () => {
                if (user) {
                  await api.voteQuestion(question.id, user.id)
                  refresh()
                }
              }}
              onUnvote={async () => {
                if (user) {
                  await api.unvoteQuestion(question.id, user.id)
                  refresh()
                }
              }}
              disabled={!user}
              title={!user ? 'Select a user to vote' : undefined}
            />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <h2 className="text-xl font-semibold leading-tight">{question.title}</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>by {question.author?.display_name}</span>
              <Badge variant="outline">{question.category ?? 'GENERAL'}</Badge>
              <Badge variant="secondary">{question.status}</Badge>
              <span>{new Date(question.created_at).toLocaleDateString()}</span>
              {question.tags?.length ? (
                <span className="flex gap-1">
                  {question.tags.map((t: string) => (
                    <Badge key={t} variant="outline">{t}</Badge>
                  ))}
                </span>
              ) : null}
            </div>
            <p className="whitespace-pre-wrap text-foreground">{question.body}</p>
            {(canEditQuestion || canCloseQuestion) && (
              <div className="flex flex-wrap gap-2 pt-2">
                {canEditQuestion && (
                  <>
                    <Button variant="default" size="sm" onClick={() => navigate(`/edit/${question.id}`)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteQuestion}>
                      Delete
                    </Button>
                  </>
                )}
                {canCloseQuestion && (
                  <Button variant="outline" size="sm" onClick={handleCloseQuestion}>
                    Close thread
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Answers</h3>
        {question.answers?.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No answers yet.</p>
            </CardContent>
          </Card>
        ) : (
          <ul className="list-none space-y-4 p-0">
            {question.answers?.map((a: any) => (
              <li key={a.id}>
                <Card className="border-l-4 border-l-primary/50">
                  <CardContent className="flex gap-4 p-4">
                    <div className="flex-shrink-0 pt-0.5">
                      <VoteButton
                        voteCount={a.voteCount ?? 0}
                        hasVoted={a.hasVoted}
                        onVote={async () => {
                          if (user) {
                            await api.voteAnswer(a.id, user.id)
                            refresh()
                          }
                        }}
                        onUnvote={async () => {
                          if (user) {
                            await api.unvoteAnswer(a.id, user.id)
                            refresh()
                          }
                        }}
                        disabled={!user}
                        title={!user ? 'Select a user to vote' : undefined}
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium">{a.doctor?.display_name}</span>
                        {a.doctor?.role === 'DOCTOR' && a.doctor?.is_verified_doctor && (
                          <Badge variant="success">Verified Doctor</Badge>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap text-foreground">{a.body}</p>
                      <AnswerEditor answer={a} currentUser={user} onUpdated={refresh} />
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {canAnswer && <AnswerEditor questionId={question.id} onCreated={refresh} currentUser={user} />}

      {similar.length > 0 && (
        <section>
          <h3 className="mb-4 text-lg font-semibold">Similar questions</h3>
          <ul className="list-none space-y-2 p-0">
            {similar.map((q: any) => (
              <li key={q.id}>
                <Link to={`/q/${q.id}`} className="block text-foreground no-underline hover:opacity-90">
                  <Card className="transition-colors hover:bg-card/80">
                    <CardContent className="p-3">
                      <p className="font-medium leading-tight">{q.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{q.author?.display_name}</span>
                        <Badge variant="outline" className="text-xs">{q.category ?? 'GENERAL'}</Badge>
                        {q.tags?.length ? (
                          <span className="flex gap-1">
                            {q.tags.slice(0, 3).map((t: string) => (
                              <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                            ))}
                          </span>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
