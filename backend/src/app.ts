import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
// import doctorRoutes from "./routes/doctor.routes"
// import patientRoutes from "./routes/patient.routes"
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes)
// app.use("/api/doctors", doctorRoutes)
// app.use("/api/patients", patientRoutes)

export default app;
