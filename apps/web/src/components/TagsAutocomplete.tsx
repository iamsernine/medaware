import { useEffect, useState, useRef } from 'react'
import { api } from '../api/client'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

const MAX_TAGS = 5

interface TagsAutocompleteProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TagsAutocomplete({ value, onChange, placeholder = 'Type to search tags...', disabled, className }: TagsAutocompleteProps) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.getTags().then((r) => setAllTags(r.data || [])).catch(() => {})
  }, [])

  // Search-style: only show suggestions when user is typing (no dropdown of all tags)
  useEffect(() => {
    const q = input.trim().toLowerCase()
    if (!q) {
      setSuggestions([])
    } else {
      setSuggestions(
        allTags.filter((t) => t.toLowerCase().includes(q) && !value.includes(t)).slice(0, 10)
      )
    }
    setOpen(!!q)
  }, [input, allTags, value])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addTag = (tag: string) => {
    const t = tag.trim()
    if (!t || value.length >= MAX_TAGS || value.includes(t)) return
    onChange([...value, t])
    setInput('')
    setOpen(false)
  }

  const removeTag = (tag: string) => {
    onChange(value.filter((x) => x !== tag))
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const first = suggestions[0]
      if (first) addTag(first)
      // No custom tags: only add from suggestions
    }
  }

  return (
    <div ref={containerRef} className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full hover:bg-muted-foreground/20"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      {value.length < MAX_TAGS && (
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
          />
          {open && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-border bg-card py-1 shadow-md">
              {suggestions.map((tag) => (
                <li key={tag}>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <p className="text-xs text-muted-foreground">Max {MAX_TAGS} tags. Type to search and select from suggestions.</p>
    </div>
  )
}
