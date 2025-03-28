import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      trim: true,
      required: [true, 'the employee_id is required'],
    },

    app_id: {
      type: String,
      trim: true,
      required: [true, 'the app_id is required'],
    },

    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
  },
  { versionKey: false },
);

export const model = mongoose.model('User', schema);
