import "./config/loadEnv"
import express from "express";
import cors from "cors";
import { ConectionDb } from "./config/db";
import userRoutes from "./Routes/userroutes"

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.get("/test", async (__, res) => {
  res.json({ message: "hello from index.js" });
});

app.use("/api/auth", userRoutes);

const StartServer = async () => {
  try {
    await ConectionDb();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀Server is running on ${port}`);
    });
  } catch (error) {

    console.log(" Failed to start server :", (error as Error).message)
  }
};


StartServer()