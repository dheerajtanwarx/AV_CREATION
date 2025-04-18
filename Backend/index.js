import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import userRouter from "./routes/userRoute.js";

const app = express();

dotenv.config();

app.use(cors({
  origin: "http://localhost:8080", // Frontend URL
  credentials: true,
}));
app.use(express.json());

app.use(cookieParser()); // To parse the incoming request with JSON payloads (from req.body)

app.get('/', (req, res) => {
  res.send("hey");
});

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use(userRouter)

app.listen(3000, () => {
  connectToMongoDB();
  console.log(`server running on port 3000`);
  console.log('MongoDB URL:', process.env.MONGO_URI);
});