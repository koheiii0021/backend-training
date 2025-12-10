import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Unhandled error', err);

    if(res.headersSent) {
        //既にレスポンスを返し始めてる場合
        return next(err);
    }

    res.status(500).json({ error: 'サーバーエラーが発生しました' });
};