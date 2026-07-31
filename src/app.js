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

// 1. Global Middlewares
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
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

// 5. App Export
module.exports = app;
