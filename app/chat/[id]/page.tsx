'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Messages } from '@/components/chat/messages'
import { ChatInput } from '@/components/chat/input'
import { ModelSelector } from '@/components/chat/model-selector'
import { DEFAULT_MODEL } from '@/lib/models'
import { type Message as DBMessage } from '@/lib/supabase'

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>()
  const [model, setModel] = useState(DEFAULT_MODEL)
  const [ready, setReady] = useState(false)
  const modelRef = useRef(model)
  modelRef.current = model

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: () => ({ model: modelRef.current, conversationId: id }),
      }),
    [id]
  )

  const { messages, sendMessage, status, setMessages } = useChat({ transport })

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/conversations/${id}`)
      if (!res.ok) return
      const { conversation, messages: dbMessages } = await res.json()
      setModel(conversation.model)
      setMessages(
        dbMessages.map((m: DBMessage) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant',
          parts: [{ type: 'text' as const, text: m.content }],
          metadata: undefined,
        }))
      )
      setReady(true)
    }
    load()
  }, [id, setMessages])

  const isLoading = status === 'streaming' || status === 'submitted'

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex items-center justify-end border-b px-4 py-2">
        <ModelSelector value={model} onChange={setModel} />
      </header>
      <Messages messages={messages} isLoading={isLoading} />
      <ChatInput onSend={(text) => sendMessage({ text })} isLoading={isLoading} />
    </div>
  )
}
