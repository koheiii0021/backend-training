import { Result } from 'pg';
import pool from './db';
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: Function ) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', ( req: Request, res: Response ) => {
    res.send('Hello World');
});

app.get('/users', async ( req: Request, res: Response ) => {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
});

app.post('/users', async (req: Request, res: Response ) => {
    const body = req.body;

    if(!body.name){
        res.status(400).json({ error: 'nameは必須です' });
        return ;
    }

    if(!body.email){
        res.status(400).json({ error: 'emailは必須です' });
        return ;
    }

    const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [body.name, body.email]
    );

    res.status(201).json(result.rows[0]);
});

app.get('/users/:id', async (req: Request, res: Response ) => {
    const userId = req.params.id;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if(result.rows.length === 0) {
        res.status(404).json({ error: 'ユーザーは見つかりません' });
        return;
    }

    res.json(result.rows[0]);
});

app.listen(3000, () => {
    console.log('Server runnning on port 3000');
});

//更新

app.put('/users/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;
    const body = req.body;

    if(!body.name){
        res.status(400).json({ error: 'nameは必須です' });
        return ;
    }

    const result = await pool.query(
        'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
        [body.name, userId]
    );

    if(result.rows.length === 0){
        res.status(404).json({ error: 'ユーザーは見つかりません' });
        return ;
    }
    res.json(result.rows[0]);
});

//DELETE

app.delete('/users/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;

    const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [userId]
    );

    if (result.rows.length === 0){
        res.status(404).json({ error: 'ユーザーが見つかりません' });
        return ;
    }

    res.json({ message: '削除しました', user: result.rows[0]});
});