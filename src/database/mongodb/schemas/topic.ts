import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  favorite: { type: Number, required: true, default: 0 },
  sessionId: { type: String, required: false },
});

const TopicModel = mongoose.model('Topic', topicSchema);

export default TopicModel;
