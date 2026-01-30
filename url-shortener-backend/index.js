import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";

connectDB().catch(err => console.error("Initial DB Connection Error:", err));

const PORT = process.env.PORT || 10000;


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;