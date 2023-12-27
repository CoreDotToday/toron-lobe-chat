import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  createdAt: { type: Number, required: false }, // .optional() 대응
  data: { type: Buffer, required: true }, // ArrayBuffer는 Buffer로 대응
  fileType: { type: String, required: true },
  name: { type: String, required: true },
  saveMode: { type: String, required: true, enum: ['local', 'url'] },
  size: { type: Number, required: true },
  url: { type: String, required: false }, // .optional() 대응
});

const FileModel = mongoose.model('File', fileSchema);

export default FileModel;
