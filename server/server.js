const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

app.listen(PORT, () => {
  console.log(`FabricFlow AI Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
