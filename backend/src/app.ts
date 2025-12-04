import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes"
import doctorRoutes from "./routes/doctor.routes"
import authRoutes from "./routes/auth.routes";
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/doctors", doctorRoutes)

export default app;
