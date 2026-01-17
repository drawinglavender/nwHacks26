import { supabase } from '../supabaseClient'

export const getMessages = async (roomId: string) => {
  return supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at')
}

export const sendMessage = async (
  roomId: string,
  content: string
) => {
  return supabase
    .from('messages')
    .insert({ room_id: roomId, content })
}
