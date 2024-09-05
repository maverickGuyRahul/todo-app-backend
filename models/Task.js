// models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  externalId: { type: Number, required: true, unique: true },
  description: String,
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  dueDate: Date,
  priority: { type: String, enum: ['Low', 'Normal', 'High'], default: 'Normal' },
  assignedTo: { type: String, required: true },
});

export default mongoose.model('Task', taskSchema);
