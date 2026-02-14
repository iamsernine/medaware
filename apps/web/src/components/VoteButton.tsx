import { useState, useEffect } from 'react'

interface VoteButtonProps {
  voteCount: number
  hasVoted?: boolean
  onVote: () => Promise<void>
  onUnvote: () => Promise<void>
  disabled?: boolean
  title?: string
}

export function VoteButton({ voteCount, hasVoted = false, onVote, onUnvote, disabled, title }: VoteButtonProps) {
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(voteCount)
  const [voted, setVoted] = useState(hasVoted)
  useEffect(() => {
    setCount(voteCount)
    setVoted(!!hasVoted)
  }, [voteCount, hasVoted])

  const handleClick = async () => {
    if (disabled || loading) return
    setLoading(true)
    try {
      if (voted) {
        await onUnvote()
        setCount((c) => c - 1)
        setVoted(false)
      } else {
        await onVote()
        setCount((c) => c + 1)
        setVoted(true)
      }
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      title={title ?? (voted ? 'Remove vote' : 'Vote up')}
      style={{
        background: voted ? '#0a6' : 'transparent',
        color: voted ? '#fff' : '#888',
        border: '1px solid #444',
        padding: '4px 8px',
        borderRadius: 4,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 14,
      }}
    >
      👍 {count}
    </button>
  )
}
