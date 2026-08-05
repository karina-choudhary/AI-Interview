const express = require('express');
const cors = require("cors");
const path = require("path");

const authroutes = require('./routes/auth.routes');
const resumeroutes = require('./routes/resume.routes');
const userroutes = require('./routes/user.routes');
const questionroutes = require('./routes/question.routes');
const interviewroutes = require('./routes/interview.routes');
const errorMiddleware = require("./utils/errorMiddleware");

const app = express();

// 1. Global Middlewares (Updated with exact dynamic origins)
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://fronted-nine.vercel.app", // FIXED: Added your active main domain
      "https://fronted-cuqmpmo7j-karinakarina-choudhary-s-projects.vercel.app"
    ], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 2. Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 3. API Routes
app.get("/", (req, res) => {
    res.send("AI Interview Platform API Running");
});
app.use("/api/auth", authroutes);
app.use("/api/resume", resumeroutes);
app.use("/api/user", userroutes);
app.use("/api/question", questionroutes);
app.use("/api/interview", interviewroutes);

// 4. Central Error Handler (MUST be after routes)
app.use(errorMiddleware);

module.exports = app;
