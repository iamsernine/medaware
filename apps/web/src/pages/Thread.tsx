import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client'
import { useUser } from '../context/UserContext'
import { AnswerEditor } from '../components/AnswerEditor'
import { VoteButton } from '../components/VoteButton'

export function Thread() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const [question, setQuestion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.getQuestion(id, user?.id).then((r) => setQuestion(r.data)).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [id, user?.id])

  const refresh = () => {
    if (!id) return
    api.getQuestion(id, user?.id).then((r) => setQuestion(r.data))
  }

  const canAnswer = !!user && question?.status === 'OPEN'
  const isAuthor = user?.id === question?.author_id
  const canEditQuestion = isAuthor
  const canCloseQuestion = question?.status === 'OPEN' && user?.role === 'DOCTOR' && user?.is_verified_doctor

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

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!question) return <p>Question not found.</p>

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0 }}>
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
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ margin: 0 }}>{question.title}</h2>
          <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>
            by {question.author?.display_name} · {question.status} · {new Date(question.created_at).toLocaleDateString()}
            {question.tags?.length ? ` · ${question.tags.join(', ')}` : ''}
          </div>
          <p style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{question.body}</p>
        {(canEditQuestion || canCloseQuestion) && (
          <div style={{ marginTop: 12 }}>
            {canEditQuestion && (
              <>
                <Link to={`/patient/edit/${question.id}`} style={{ marginRight: 12, color: '#0af' }}>Edit</Link>
                <button onClick={handleDeleteQuestion} style={{ marginRight: 12, color: '#f55' }}>Delete</button>
              </>
            )}
            {canCloseQuestion && (
              <button onClick={handleCloseQuestion} style={{ color: '#f90' }}>Close thread</button>
            )}
          </div>
        )}
        </div>
      </div>
      <h3>Answers</h3>
      {question.answers?.length === 0 ? (
        <p>No answers yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {question.answers?.map((a: any) => (
            <li key={a.id} style={{ borderLeft: '3px solid #444', paddingLeft: 16, marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
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
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, marginBottom: 4 }}>
                  {a.doctor?.display_name}
                  {a.doctor?.role === 'DOCTOR' && a.doctor?.is_verified_doctor && (
                    <span style={{ marginLeft: 8, background: '#0a6', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                      Verified Doctor
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{a.body}</p>
                <AnswerEditor answer={a} currentUser={user} onUpdated={refresh} />
              </div>
            </li>
          ))}
        </ul>
      )}
      {canAnswer && <AnswerEditor questionId={question.id} onCreated={refresh} currentUser={user} />}
    </div>
  )
}
