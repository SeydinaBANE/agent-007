'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SquarePen, Trash2, MessageSquare } from 'lucide-react'
import { type Conversation } from '@/lib/supabase'
import { getAnonymousId } from '@/lib/anonymous-id'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const router = useRouter()
  const params = useParams()
  const activeId = params?.id as string | undefined

  const [conversations, setConversations] = useState<Conversation[]>([])

  const load = async () => {
    const id = getAnonymousId()
    const res = await fetch(`/api/conversations?anonymous_id=${id}`)
    if (res.ok) setConversations(await res.json())
  }

  useEffect(() => {
    load()
  }, [activeId])

  const newChat = async () => {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anonymous_id: getAnonymousId() }),
    })
    const conv = await res.json()
    router.push(`/chat/${conv.id}`)
  }

  const deleteConv = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeId === id) router.push('/')
  }

  return (
    <aside className="flex w-60 flex-col border-r bg-muted/30 shrink-0">
      <div className="flex items-center justify-between p-3 border-b">
        <span className="text-sm font-semibold">Conversations</span>
        <Button variant="ghost" size="icon-sm" onClick={newChat}>
          <SquarePen className="size-4" />
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {conversations.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6">No conversations yet.</p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => router.push(`/chat/${conv.id}`)}
            className={cn(
              'group flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer text-xs',
              activeId === conv.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background hover:text-foreground'
            )}
          >
            <MessageSquare className="size-3.5 shrink-0" />
            <span className="flex-1 truncate">{conv.title}</span>
            <button
              onClick={(e) => deleteConv(e, conv.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </nav>
    </aside>
  )
}
