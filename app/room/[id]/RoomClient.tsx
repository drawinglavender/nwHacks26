'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/src/supabaseClient'
import { getMessages, sendMessage } from '@/src/services/messages'

export default function RoomClient({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [name] = useState(() => 'Soul-' + Math.floor(Math.random() * 10000))

  useEffect(() => {
    // Load initial messages
    getMessages(roomId).then(({ data }) => {
      if (data) setMessages(data)
    })

    // Subscribe to realtime updates
    const channel = supabase
      .channel('room-' + roomId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        payload => {
          setMessages(m => [...m, payload.new as any])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])

  const handleSend = async () => {
    if (!input.trim()) return
    await sendMessage(roomId, input, name)
    setInput('')
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat Room</h2>

      <div style={{ marginBottom: 16, maxHeight: 400, overflowY: 'auto' }}>
        {messages.map(m => (
          <div key={m.id}>
            <strong>{m.sender_name}:</strong> {m.content}
          </div>
        ))}
      </div>

      <input
        style={{ width: '70%', marginRight: 8 }}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Say something..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}
