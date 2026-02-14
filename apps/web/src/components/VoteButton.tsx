import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <Button
      type="button"
      variant={voted ? 'default' : 'outline'}
      size="sm"
      onClick={handleClick}
      disabled={disabled || loading}
      title={title ?? (voted ? 'Remove vote' : 'Vote up')}
      className={cn('gap-1.5', voted && 'bg-primary')}
    >
      <ThumbsUp className="size-4" />
      {count}
    </Button>
  )
}
