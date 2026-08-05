require("dotenv").config(); // MUST be the first line to parse API keys perfectly
const app = require("./src/app");
const connectDB = require("./src/config/db");

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
