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
app.use(cors());

// Routes
app.use("/api/user", userRoutes);      
app.use("/api/chat", chatRoutes);
app.use("/api/gemini", geminiRoutes);

const PORT = process.env.PORT || 8000;

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
