import { supabase } from '@/src/supabaseClient'

// Get all rooms
export const getRooms = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) console.error('Error fetching rooms:', error)
  return { data, error }
}

// Get a single room by id
export const getRoomById = async (id: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single()

  if (error) console.error('Error fetching room:', error)
  return { data, error }
}

// Create a new room
export const createRoom = async (name: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .insert([{ name }])
    .select()

  if (error) console.error('Error creating room:', error)
  return { data, error }
}

// Optional: delete a room
export const deleteRoom = async (id: string) => {
  const { data, error } = await supabase.from('rooms').delete().eq('id', id)
  if (error) console.error('Error deleting room:', error)
  return { data, error }
}