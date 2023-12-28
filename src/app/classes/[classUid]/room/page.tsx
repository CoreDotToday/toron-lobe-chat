import { redirect } from 'next/navigation';

export interface RoomPageProps {
  params: { classUid: string };
}
const fetchRoomUid = async () => {
  const res = await fetch('https://info.api.toron.ai/v1/room/uid/', { cache: 'no-cache' });
  const data = await res.json();

  return data.room_uid;
};

export default async function RoomPage({ params }: RoomPageProps) {
  const roomUid = await fetchRoomUid();
  if (roomUid) {
    redirect(`/classes/${params.classUid}/room/${roomUid}`);
  }
  return (
    <div>
      <h1>Room Page</h1>
    </div>
  );
}
