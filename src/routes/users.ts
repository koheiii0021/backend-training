import { Router, Request, Response } from "express";
import { pool } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";

export const usersRouter = Router();


//一覧
usersRouter.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email FROM users ORDER BY id',
        )

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('DB error', err);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});

//詳細
usersRouter.get('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        //IDが0以下かNuNか判定
        if(!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: 'id は無効です' });
            return ;
        }
        //1件取得
        const result = await pool.query(
            'SELECT id, name, email FROM users WHERE id = $1',
            [id]
        );

        //IDがあるか判定
        if(result.rows.length === 0){
            res.status(404).json({ error: 'IDが見つかりません' });
            return ;
        }
        //成功
        res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error('DB error', err);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});

//更新
usersRouter.put('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;

        if(!name || !email) {
            res.status(400).json({ error: 'name, emailは必須です' });
            return ;
        }

        const id = Number(req.params.id);

        if(!Number.isInteger(id) || id < 0){
            res.status(400).json({ error: 'IDが見つかりません' });
            return ;
        }

        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
            [name, email, id]
        )

        if(result.rows.length === 0){
            res.status(404).json({ error: '該当ユーザーなし' });
            return ;
        }

        res.status(200).json(result.rows[0])
    } catch (err) {
        console.error('DB error', err);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }

});

//削除
usersRouter.delete('/:id', authMiddleware, async ( req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if(!Number.isInteger(id) || id <= 0){
            res.status(400).json({ error: 'IDは必須です' });
            return ;
        }

        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [id]
        )

        if(result.rows.length === 0){
            res.status(404).json({ error: 'ユーザーがみつかりません' });
            return ;
        }

        res.sendStatus(204);
    } catch (err) {
        console.error('DB error', err);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});

