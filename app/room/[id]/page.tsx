import RoomClient from './RoomClient'

export default function RoomPage({ params }: { params: { id: string } }) {
  const roomId = params.id // safe in Server Component
  return <RoomClient roomId={roomId} />
}
