'use client';

import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';

// 메시지 타입 정의
interface Message {
  room_uid: string;
  client_num: number;
  connection_id: string;
  msg: string;
  stream_uid: string;
  sent_uid: string | null;
  cAt: string;
  return_voice: number;
  voice_url: string | null;
  voice_length: number | null;
}

interface ChatComponentProps {
  roomUid: string;
}

function ChatComponent({ roomUid }: ChatComponentProps) {
  // State for storing the extracted variables
  const { user } = useUser();
  const userId = user?.id;
  const userName = user?.fullName;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const [messageQueue, setMessageQueue] = useState<Message[]>([]);

  const [shouldReconnect, setShouldReconnect] = useState(true);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  console.log(messageQueue);

  // 오디오와 텍스트 메시지를 하나의 큐로 처리하기 위한 함수
  const processQueueItem = () => {
    if (messageQueue.length === 0 || isAudioPlaying) return;

    const currentMessage = messageQueue[0];

    if (currentMessage.return_voice === 1 && currentMessage.voice_url) {
      const audio = new Audio(currentMessage.voice_url);
      setIsAudioPlaying(true);

      audio.addEventListener('ended', () => {
        setIsAudioPlaying(false);
        setMessageQueue((currentQueue) => currentQueue.slice(1));
      });

      audio.play();
    } else {
      setMessages((prevMessages) => {
        // stream_uid가 같은 메시지 찾기
        const existingMessageIndex = prevMessages.findIndex(
          (m) => m.stream_uid === currentMessage.stream_uid,
        );

        if (existingMessageIndex !== -1) {
          // 이미 존재하는 메시지 업데이트
          const updatedMessages = [...prevMessages];
          updatedMessages[existingMessageIndex] = {
            ...updatedMessages[existingMessageIndex],
            msg: updatedMessages[existingMessageIndex].msg + currentMessage.msg,
          };
          return updatedMessages;
        } else {
          // 새로운 메시지 추가
          return [...prevMessages, currentMessage];
        }
      });
      setMessageQueue((currentQueue) => currentQueue.slice(1));
    }
  };

  useEffect(() => {
    // 메시지 큐에 메시지가 있고 오디오가 재생 중이지 않을 때만 processQueueItem 함수 호출
    if (messageQueue.length > 0 && !isAudioPlaying) {
      processQueueItem();
    }
  }, [messageQueue, isAudioPlaying]);

  const connectWebSocket = () => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log('Maximum reconnect attempts reached');
      setShouldReconnect(false);
      return;
    }

    const newSocket = new WebSocket(
      `wss://ws.api.chldo.com/v1/?room_uid=${roomUid}&user_uid=${userId}`,
    );

    newSocket.addEventListener('open', () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      setReconnectAttempts(0);
    });

    newSocket.addEventListener('close', () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
      if (shouldReconnect) {
        setTimeout(() => {
          setReconnectAttempts((prev) => prev + 1);
          connectWebSocket();
        }, 1000); // Reconnect after 1 second
      }
    });

    newSocket.addEventListener('message', (event) => {
      const receivedMessage: Message = JSON.parse(event.data);
      if (!messageQueue.some((msg) => msg.sent_uid === receivedMessage.sent_uid)) {
        setMessageQueue((currentQueue) => [...currentQueue, receivedMessage]);
      }
    });

    setSocket(newSocket);
  };

  // WebSocket 연결
  useEffect(() => {
    if (!userId) return;
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [
    userId,
    setShouldReconnect,
    setIsConnected,
    setReconnectAttempts,
    setMessageQueue,
    setSocket,
  ]);

  const sendMessage = () => {
    if (!socket || !isConnected) return;

    const msgData = {
      action: 'sendmessage',
      user_uid: userId,
      room_uid: roomUid,
      subject: 'subject',
      questioner: userName || '사용자',
      receiver_uid: 'hyscent',
      msg: message,
      return_voice: 1,
    };
    socket.send(JSON.stringify(msgData));
    setMessage('');
    setMessages((prevMessages) => {
      const timestamp = Date.now() / 1000;
      return [
        ...prevMessages,
        {
          room_uid: roomUid,
          client_num: -1,
          connection_id: 'userInput',
          msg: message,
          stream_uid: `userInput-${timestamp}`,
          sent_uid: userId || null,
          cAt: `${timestamp}`,
          return_voice: 0,
          voice_url: null,
          voice_length: null,
        },
      ];
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="grid">
      {isConnected ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 my-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지 입력"
            className="flex-1 p-2 border rounded shadow"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded shadow">
            보내기
          </button>
        </form>
      ) : userId ? (
        <div className="flex flex-wrap gap-2">
          <p>WebSocket 연결이 끊어졌습니다.</p>
          <button
            type="button"
            onClick={connectWebSocket}
            className="px-4 py-2 bg-green-500 text-white rounded shadow"
          >
            재연결 시도
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">Loading...</div>
      )}
      <div className="flex flex-col flex-wrap gap-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.connection_id === 'userInput' ? `text-right ml-auto` : ``}
          >
            {msg.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatComponent;
