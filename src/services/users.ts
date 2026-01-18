// src/lib/services/users.ts
import { supabase } from '@/src/supabaseClient'

interface SoulColor {
  name: string
  description: string
  hex: string
}

const SOUL_COLORS: SoulColor[] = [
  { name: 'Obsidian Violet', description: 'Quietly visionary. You think in long arcs and speak only when it matters.', hex: '#5B3A70' },
  { name: 'Fog Blue', description: 'Curious and inward. You explore ideas softly, letting meaning unfold over time.', hex: '#A3C4D9' },
  { name: 'Iron Crimson', description: 'Clear and commanding. You bring direction and momentum into every conversation.', hex: '#8B0000' },
  { name: 'Electric Gold', description: 'Playful and sharp. You ignite ideas and keep conversations alive with possibility.', hex: '#FFD700' },
  { name: 'Deep Indigo', description: 'Reflective and intuitive. You sense what’s unspoken and respond with care.', hex: '#3F00FF' },
  { name: 'Rose Quartz', description: 'Gentle and sincere. You lead with feeling and value emotional truth.', hex: '#F7CAC9' },
  { name: 'Sunlit Amber', description: 'Warm and encouraging. You help others feel seen and understood.', hex: '#FFBF00' },
  { name: 'Sunset Coral', description: 'Open and expressive. You bring warmth, curiosity, and emotional color into the room.', hex: '#FF6F61' },
  { name: 'Slate Gray', description: 'Grounded and steady. You offer clarity through consistency and calm.', hex: '#708090' },
  { name: 'Soft Sage', description: 'Protective and thoughtful. You create safety through quiet presence.', hex: '#B2AC88' },
  { name: 'Stone Bronze', description: 'Structured and reliable. You anchor conversations with clarity and purpose.', hex: '#7C482B' },
  { name: 'Blush Gold', description: 'Attentive and social. You tune into others and build connection with ease.', hex: '#F2C777' },
  { name: 'Steel Blue', description: 'Calm and precise. You observe carefully and act with intention.', hex: '#4682B4' },
  { name: 'Lavender Mist', description: 'Sensitive and present. You notice beauty and emotion in subtle moments.', hex: '#E6E6FA' },
  { name: 'Ember Red', description: 'Bold and immediate. You bring energy and aliveness into the now.', hex: '#FF4500' },
  { name: 'Golden Peach', description: 'Warm and radiant. You invite joy, openness, and shared experience.', hex: '#FFDAB9' },
]

// Create a user with a random soul color
export const createUser = async (phoneNumber: string) => {
  const color = SOUL_COLORS[Math.floor(Math.random() * SOUL_COLORS.length)]

  const { data, error } = await supabase
    .from('users')
    .insert([{
      phone_number: phoneNumber,
      soul_color_name: color.name,
      soul_color_hex: color.hex
    }])
    .select()

  if (error) console.error('Error creating user:', error)
  return { data, error }
}

// Fetch a user by ID
export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) console.error('Error fetching user:', error)
  return { data, error }
}
