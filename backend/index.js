import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";

dotenv.config();

const app = express();

//  Allow only your frontend URL
const allowedOrigins = [
  process.env.CLIENT_URL, 
  "http://localhost:5173"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/gemini", geminiRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ success: true, message: "Chatbot Backend API is running successfully" });
});

const PORT = process.env.PORT || 8000;

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
