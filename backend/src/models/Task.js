import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
    status: { type: String, enum: ['OPEN', 'DONE'], default: 'OPEN' },
    label: { type: String, enum: ['Urgent', 'Important', 'Review', 'Done', ''], default: '' },
    project: { type: String, enum: ['Work', 'Personal', 'Learning', 'Inbox'], default: 'Inbox' },
    effortMins: { type: Number },
    orderIndex: { type: Number, default: 0 },
    pomodoroSessions: [
      {
        startedAt: Date,
        endedAt: Date,
        durationMins: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);


