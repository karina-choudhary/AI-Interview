const express = require('express');
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
const authroutes =require('./routes/auth.routes');
const resumeroutes =require('./routes/resume.routes');
const userroutes =require('./routes/user.routes');
const questionroutes =require('./routes/question.routes');
const interviewroutes =require('./routes/interview.routes');
const path = require("path");
// 1. Pehle saare routes aur middleware likho
app.get("/", (req, res) => {
    res.send("AI Interview Platform API Running");

});
app.use("/api/auth", authroutes);
app.use("/api/resume",resumeroutes);
app.use("/api/user", userroutes);
app.use("/api/question", questionroutes);
app.use("/api/interview", interviewroutes);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 2. Sabse aakhri me export karo taaki routes sath me jayein
module.exports = app; 
