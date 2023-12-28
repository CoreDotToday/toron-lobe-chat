'use client';

import React, { useCallback, useEffect, useState } from 'react';

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

function ChatComponent() {
  // State for storing the extracted variables
  const [subject, setSubject] = useState('');
  const [roomUid, setRoomUid] = useState('');
  useEffect(() => {
    // Assuming the URL is something like "/dashboard/room/[subject]/[roomuid]/page"
    const pathParts = window.location.pathname.split('/').filter(Boolean); // Remove empty parts
    if (pathParts.length >= 4) {
      setSubject(pathParts[2]); // Adjust indexes based on your URL structure
      setRoomUid(pathParts[3]);
    }
  }, []);

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const [messageQueue, setMessageQueue] = useState<Message[]>([]);

  // 오디오와 텍스트 메시지를 하나의 큐로 처리하기 위한 함수
  const processQueueItem = useCallback(() => {
    if (messageQueue.length > 0 && !isAudioPlaying) {
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
        setMessages((prevMessages) => [...prevMessages, currentMessage]);
        setMessageQueue((currentQueue) => currentQueue.slice(1));
      }
    }
  }, [messageQueue, isAudioPlaying]);

  useEffect(() => {
    if (messageQueue.length > 0 && !isAudioPlaying) {
      processQueueItem();
    }
  }, [messageQueue, isAudioPlaying, processQueueItem]);

  const connectWebSocket = useCallback(() => {
    const newSocket = new WebSocket('wss://ws.api.chldo.com/v1/?room_uid=AAB&user_uid=s8dfkjsdf');

    newSocket.addEventListener('open', () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    });

    newSocket.addEventListener('close', () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    });

    newSocket.addEventListener('message', (event) => {
      const receivedMessage: Message = JSON.parse(event.data);
      if (!messageQueue.some((msg) => msg.sent_uid === receivedMessage.sent_uid)) {
        setMessageQueue((currentQueue) => [...currentQueue, receivedMessage]);
      }
    });

    setSocket(newSocket);
  }, [messageQueue]);

  // WebSocket 연결
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connectWebSocket]);

  const sendMessage = () => {
    if (socket && isConnected) {
      const msgData = {
        action: 'sendmessage',
        user_uid: 's8dfkjsdf',
        room_uid: '4S28AFuOYA0w',
        subject: 'subject',
        questioner: '고구마',
        receiver_uid: 'hyscent',
        msg: message,
        return_voice: 1,
      };
      socket.send(JSON.stringify(msgData));
      setMessage('');
    }
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
      ) : (
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
      )}
      <div className="flex flex-wrap gap-2">
        {messages.map((msg, index) => (
          <span key={index} className="p-2 bg-gray-200 rounded">
            {msg.msg}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ChatComponent;
