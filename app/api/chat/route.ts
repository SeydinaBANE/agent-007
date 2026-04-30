import { createOpenAI } from '@ai-sdk/openai'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { supabase } from '@/lib/supabase'
import { MODELS, DEFAULT_MODEL } from '@/lib/models'

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(req: Request) {
  const body = await req.json()
  const { messages, model = DEFAULT_MODEL, conversationId } = body as {
    messages: UIMessage[]
    model: string
    conversationId: string
  }

  if (!MODELS.some((m) => m.id === model)) {
    return Response.json({ error: 'Invalid model' }, { status: 400 })
  }

  const modelMessages = await convertToModelMessages(messages)

  const lastMessage = messages[messages.length - 1]
  if (conversationId && lastMessage?.role === 'user') {
    const userText = lastMessage.parts
      .filter((p) => p.type === 'text')
      .map((p) => (p as { type: 'text'; text: string }).text)
      .join('')

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: userText,
    })
  }

  const result = streamText({
    model: openrouter.chat(model),
    messages: modelMessages,
    onFinish: async ({ text }) => {
      if (!conversationId) return

      await supabase.from('messages').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: text,
      })

      const isFirstExchange = messages.length === 1
      const update = isFirstExchange
        ? { title: lastMessage.parts
              .filter((p) => p.type === 'text')
              .map((p) => (p as { type: 'text'; text: string }).text)
              .join('')
              .slice(0, 60),
            updated_at: new Date().toISOString() }
        : { updated_at: new Date().toISOString() }

      await supabase.from('conversations').update(update).eq('id', conversationId)
    },
  })

  return result.toUIMessageStreamResponse()
}
