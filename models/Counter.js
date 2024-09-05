// models/Counter.js
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Identifier for the counter (e.g., 'taskId')
  seq: { type: Number, default: 0 }, // Sequence number
});

export default mongoose.model('Counter', counterSchema);
