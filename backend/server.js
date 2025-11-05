import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/Mongodb.js";
import userRouter from "./routers/userRouter.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDb();

app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is Running at port: ${PORT}`);
});
