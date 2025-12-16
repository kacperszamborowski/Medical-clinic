import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import scheduleRoutes from "./routes/schedule.routes";
import appointmentRoutes from "./routes/appointment.routes";
import appointmentDetailsRoutes from "./routes/appointment.details.routes";
import doctorRoutes from "./routes/doctor.routes";
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/appointments/details", appointmentDetailsRoutes)
app.use("/doctors", doctorRoutes)

export default app;