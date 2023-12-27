import mongoose from 'mongoose';

const translateSchema = new mongoose.Schema({
  from: { type: String, required: false },
  to: { type: String, required: true },
  content: { type: String, required: false },
});

const pluginSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  arguments: { type: String, required: true },
  apiName: { type: String, required: true },
  type: { type: String, required: true, default: 'default', enum: ['default', 'standalone'] },
});

const messageSchema = new mongoose.Schema({
  role: { type: String, required: true, enum: ['user', 'system', 'assistant', 'function'] },
  content: { type: String, required: true },
  files: { type: [String], required: false },
  favorite: { type: Number, required: false, min: 0, max: 1 },
  error: { type: mongoose.Schema.Types.Mixed, required: false },

  plugin: { type: pluginSchema, required: false },
  pluginState: { type: mongoose.Schema.Types.Mixed, required: false },
  fromModel: { type: String, required: false },
  translate: { type: translateSchema, required: false, default: null },
  tts: { type: mongoose.Schema.Types.Mixed, required: false },

  parentId: { type: String, required: false },
  quotaId: { type: String, required: false },
  sessionId: { type: String, required: true },
  topicId: { type: String, required: false },
});

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
