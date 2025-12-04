import express from "express";
import userRoutes from "./routes/user.routes"
import doctorRoutes from "./routes/doctor.routes"

const app = express();
app.use(express.json());

// Routes
app.use("/api/users", userRoutes)
app.use("/api/doctors", doctorRoutes)

export default app;