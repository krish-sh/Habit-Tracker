import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  frequency: [
    {
      type: String,
      required: true,
    },
  ],
  logs: [
    {
      date: String,
      completed: Boolean,
    },
  ],
});

const habitModel =
  mongoose.Schema.Habit || mongoose.model("Habit", habitSchema);

export default habitModel;
