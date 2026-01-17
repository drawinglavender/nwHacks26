'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { getMessages, sendMessage } from '@/lib/services/messages'

export default function RoomPage({ params }: { params: { id: string } }) {
  const roomId = params.id
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    getMessages(roomId).then(({ data }) => {
      if (data) setMessages(data)
    })

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
    await sendMessage(roomId, input)
    setInput('')
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat Room</h2>

      <div style={{ marginBottom: 16 }}>
        {messages.map(m => (
          <div key={m.id}>{m.content}</div>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Say something..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}
