import ChatComponent from '@/components/ChatComponent';

export interface RoomUidPageProps {
  params: { classUid: string; roomUid: string };
}
export default function RoomUidPage({ params }: RoomUidPageProps) {
  return (
    <div className="px-8 py-12 sm:py-16 md:px-20">
      <h1 className="text-3xl font-semibold text-black">Room Page</h1>
      {/* ChatComponent를 클라이언트 컴포넌트로 사용 */}
      <ChatComponent roomUid={params.roomUid} />
    </div>
  );
}
