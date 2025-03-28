import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'the name is required'],
      unique: [true, 'the provided name must be unique'],
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { versionKey: false },
);

export const model = mongoose.model('Role', schema);
