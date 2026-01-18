import { supabase } from '@/src/supabaseClient'

export const getMessages = async (roomId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })

  if (error) console.error('Fetch messages error:', error)
  return { data, error }
}

export const sendMessage = async (
  roomId: string,
  content: string,
  senderName: string
) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        room_id: roomId,
        content,
        sender_name: senderName,
      },
    ])
  if (error) console.error('Send message error:', error)
  return { data, error }
}
