import mongoose from 'mongoose';

const fewShotsSchema = new mongoose.Schema({
  content: { type: String, required: true },
  role: { type: String, required: true },
});

const ttsSchema = new mongoose.Schema({
  showAllLocaleVoice: { type: Boolean, required: false },
  sttLocale: { type: String, required: true, default: 'auto' },
  ttsService: { type: String, required: true, default: 'openai' },
  voice: {
    edge: { type: String, required: false },
    microsoft: { type: String, required: false },
    openai: { type: String, required: true, default: '' },
  },
});

const agentSchema = new mongoose.Schema({
  autoCreateTopicThreshold: { type: Number, required: true, default: 2 },
  compressThreshold: { type: Number, required: false },
  displayMode: { type: String, required: false, enum: ['chat', 'docs'] },
  enableAutoCreateTopic: { type: Boolean, required: true, default: true },
  enableCompressThreshold: { type: Boolean, required: false },
  enableHistoryCount: { type: Boolean, required: false },
  enableMaxTokens: { type: Boolean, required: false },
  fewShots: { type: [fewShotsSchema], required: false },
  historyCount: { type: Number, required: false, default: 8 },
  inputTemplate: { type: String, required: false },
  model: { type: String, required: true, default: 'gpt-3.5-turbo' },
  params: {
    frequency_penalty: { type: Number, required: false, default: 0 },
    max_tokens: { type: Number, required: false },
    presence_penalty: { type: Number, required: false, default: 0 },
    temperature: { type: Number, required: true, default: 0.6 },
    top_p: { type: Number, required: true, default: 1 },
  },
  plugins: { type: [String], required: false },
  systemRole: { type: String, required: true, default: '' },
  tts: { type: ttsSchema, required: false },
});

const sessionSchema = new mongoose.Schema({
  config: { type: agentSchema, required: true },
  group: { type: String, required: true, default: 'default' },
  meta: { type: mongoose.Schema.Types.Mixed, required: true }, // LobeMetaDataSchema는 별도의 Mongoose Schema로 변환해야 할 수 있음
  type: { type: String, required: true, default: 'agent', enum: ['agent', 'group'] },
});

const SessionModel = mongoose.model('Session', sessionSchema);

export default SessionModel;
