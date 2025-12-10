import express from "express";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

//共通ミドルウェア
app.use(express.json());

//ヘルスチェック
app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

//ルーター
app.use('/auth', authRouter);
app.use('/users', usersRouter);

//エラーハンドラー
app.use(errorHandler);