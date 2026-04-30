import { supabase } from '@/lib/supabase'
import { DEFAULT_MODEL } from '@/lib/models'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const anonymousId = searchParams.get('anonymous_id')

  if (!anonymousId) {
    return Response.json({ error: 'anonymous_id required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('anonymous_id', anonymousId)
    .order('updated_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json(data)
}

export async function POST(req: Request) {
  const { anonymous_id, model = DEFAULT_MODEL } = await req.json()

  if (!anonymous_id) {
    return Response.json({ error: 'anonymous_id required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert({ anonymous_id, model, title: 'New conversation' })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json(data, { status: 201 })
}
