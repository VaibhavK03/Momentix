import dotenv from "dotenv"
import express from "express"

import connectDB from "./db/database.js"
const app = express()
const PORT = process.env.PORT || 8000

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
  app.listen( PORT, () => {
    console.log("Server is running at PORT 8000");
  })
})
.catch((err) => {
  console.log("MongoDB connection failed", err);
})