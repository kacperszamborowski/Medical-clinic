import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/auth", authRoutes);

export default app;