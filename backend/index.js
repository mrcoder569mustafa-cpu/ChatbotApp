import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";

dotenv.config();

const app = express();


app.use(express.json());

/* ===== Production Level CORS ===== */
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

/* =======================
   ROUTES
======================= */
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/gemini", geminiRoutes);

/* =======================
   HEALTH CHECK (IMPORTANT)
======================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chatbot Backend API is running successfully",
  });
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 8000;

connectDb()
  .then(() => {
    app.listen(PORT, () =>
      console.log(` Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error(" DB Connection Failed:", err);
  });


connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
