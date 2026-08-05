const express = require("express");
const cors = require("cors");
const path = require("path");

const authroutes = require("./routes/auth.routes");
const resumeroutes = require("./routes/resume.routes");
const userroutes = require("./routes/user.routes");
const questionroutes = require("./routes/question.routes");
const interviewroutes = require("./routes/interview.routes");
const errorMiddleware = require("./utils/errorMiddleware");

const app = express();

// =========================
// CORS Configuration
// =========================

const allowedOrigins = [
  "http://localhost:5173",
  "https://fronted-nine.vercel.app",
  "https://fronted-cuqmpmo7j-karinakarina-choudhary-s-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / Mobile Apps
      if (!origin) {
        return callback(null, true);
      }

      // Allowed Origins
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


// =========================
// Static Folder
// =========================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// =========================
// API Routes
// =========================

app.get("/", (req, res) => {
  res.send("AI Interview Platform API Running...");
});

app.use("/api/auth", authroutes);
app.use("/api/resume", resumeroutes);
app.use("/api/user", userroutes);
app.use("/api/question", questionroutes);
app.use("/api/interview", interviewroutes);


// =========================
// Error Middleware
// =========================

app.use(errorMiddleware);


// =========================

module.exports = app;