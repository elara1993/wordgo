import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { errorHandler, notFound } from "./middleware/errorHandler";
import wordsRouter from "./routes/words";
import usersRouter from "./routes/users";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "4000");

// 中间件
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use("/api/words", wordsRouter);
app.use("/api/users", usersRouter);

// 健康检查
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 错误处理
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 WordGo Backend running on http://localhost:${PORT}`);
  console.log(`📖 API docs: http://localhost:${PORT}/api/health`);
});
