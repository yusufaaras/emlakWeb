import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database";
import authRoutes from "./routes/authRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import propertyRoutes from "./routes/propertyRoutes"; // <-- EKLENDI

dotenv.config();
console.log('DEBUG: Loaded DATABASE_URL =', process.env.DATABASE_URL); // <- ekle / kontrol için

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public / auth routes
app.use("/api/auth", authRoutes);

// Property route (add / list / update)
app.use("/api/properties", propertyRoutes); // <-- EKLENDI

// Diğer korumalı routelar (profile vb.)
app.use("/api", protectedRoutes);

sequelize.sync().then(() => {
  console.log("📌 Database connected!");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((error) => {
  console.error("❌ Database connection error:", error);
});