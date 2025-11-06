import mongoose from 'mongoose';

const labelSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Label', labelSchema);


