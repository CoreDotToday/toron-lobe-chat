// db.ts
import mongoose from 'mongoose';

import FileModel from '../schemas/file';
import MessageModel from '../schemas/message';
import SessionModel from '../schemas/session';
import TopicModel from '../schemas/topic';

// MongoDB 데이터베이스에 연결

await mongoose.connect(process.env.MONGODB_URI!).catch((error) => {
  console.error('MongoDB 연결 에러:', error);
});

// 모델 인스턴스를 export
export { default as FileModel } from '../schemas/file';
export { default as MessageModel } from '../schemas/message';
export { default as SessionModel } from '../schemas/session';
export { default as TopicModel } from '../schemas/topic';

// ================================================ //
// ================================================ //
// ================================================ //
// ================================================ //
// ================================================ //

// types helper
// MongoDB 모델 타입을 정의합니다. 이 타입은 기존에 사용하던 타입과 호환되도록 할 수 있습니다.
// 예를 들어, 애플리케이션 로직에서 이 타입들을 참조하고 있다면, 이 부분을 업데이트해야 할 수 있습니다.
export type MongoDBSchema = {
  files: typeof FileModel;
  messages: typeof MessageModel;
  sessions: typeof SessionModel;
  topics: typeof TopicModel;
};
