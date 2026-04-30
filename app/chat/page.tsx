'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getAnonymousId } from '@/lib/anonymous-id'
import { DEFAULT_MODEL } from '@/lib/models'

export default function ChatPage() {
  const router = useRouter()

  useEffect(() => {
    const create = async () => {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymous_id: getAnonymousId(), model: DEFAULT_MODEL }),
      })
      const conv = await res.json()
      router.replace(`/chat/${conv.id}`)
    }
    create()
  }, [router])

  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
      Starting new conversation…
    </div>
  )
}
