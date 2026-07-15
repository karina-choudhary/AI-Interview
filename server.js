require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db"); // path check kar lena

const port = 5000;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
