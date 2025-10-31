import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected Successfully");
    });

    mongoose.connection.off("connection", () => {
      console.log("MongoDB connection off");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}`);
  } catch (error) {
    console.log("Error in mongoose connection");
  }
};

export default connectDb;
