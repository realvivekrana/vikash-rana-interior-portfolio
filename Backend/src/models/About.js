import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Vikash Rana' },
    title: { type: String, default: 'Interior Designer' },
    bio: { type: String, default: '' },
    photo: { url: String, public_id: String },
    stats: [
      {
        _id: false,
        label: { type: String, required: true }, // Projects Done, Years Experience
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('About', aboutSchema);