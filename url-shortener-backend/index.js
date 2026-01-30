import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";
connectDB().catch(err => console.error("Initial DB Connection Error:", err));

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running locally on PORT ${PORT}`);
  });
}

export default app;
