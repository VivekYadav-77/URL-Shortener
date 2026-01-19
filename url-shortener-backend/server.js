import dotenv from "dotenv"
dotenv.config()
import app  from './app.js'
import connectDB from "./config/db.js"
connectDB()
const PORT = process.env.PORT||3000
app.listen(PORT,()=>{
    console.log(`server is running on the PORT ${PORT}`)
})
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down safely...");
  console.error(err.name, err.message);
  
  // Close server first, then exit the process
  server.close(() => {
    process.exit(1); 
  });
});

// 2. Handle Uncaught Exceptions 
process.on("uncaughtException", (err) => {
  console.error(" UNCAUGHT EXCEPTION! Force shutting down...");
  console.error(err.stack);
  process.exit(1);
});