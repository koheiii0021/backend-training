import pool from './db';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { resourceLimits } from 'worker_threads';

//本番では環境変数に入れる。とりあえず今は直接
const SECRET_KEY = 'your-secret-key-here';

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: Function ) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

//認証ミドルウェア
const authMiddleware = (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        res.status(401).json({ error: 'トークンがありません' });
        return ;
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, SECRET_KEY);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'トークンが無効です' });
    }
};

app.get('/', ( req: Request, res: Response ) => {
    res.send('Hello World');
});

app.get('/users', async ( req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('DBエラー:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});

app.post('/users', async (req: Request, res: Response ) => {
    try { 
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

    } catch (error) {
        console.error('DBエラー:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});

//signupエンドポイント

app.post('/signup', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password ){
            res.status(404).json({ error: 'name, email, passwordは必須です'});
            return ;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        )

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('エラー', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});

//login　エンドポイント
app.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            res.status(401).json({ error: 'email, passwordは必須です' });
            return ;
        }

        //メールでユーザー検索
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        if(result.rows.length === 0){
            res.status(401).json({ error: 'メールアドレスまたはパスワードが間違っています' });
            return ;
        }

        const user = result.rows[0];

        //パスワード照合
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            res.status(404).json({ error: 'メールアドレスまたはパスワードが間違っています' });
            return ;
        }

        //トークン発行
        const token = jwt.sign(
            { userId: user.id, email: user.email},
            SECRET_KEY,
            { expiresIn: '24h'}
        )

        res.json({ token });
    } catch (error) {
        console.error('エラー', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});

app.get('/users/:id', async (req: Request, res: Response ) => {
    try {
        const userId = req.params.id;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        
        
        if(result.rows.length === 0) {
            res.status(404).json({ error: 'ユーザーは見つかりません' });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('DBエラー:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました。' });
}});

//更新

app.put('/users/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;
    const body = req.body;

    if(!body.name){
        res.status(404).json({ error: 'nameは必須です' });
        return ;
    }

    const result = await pool.query(
        'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
        [body.name, userId]
    );

    if(result.rows.length === 0){
        res.status(404).json({ error: 'ユーザーが見つかりません' });
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

    if(result.rows.length === 0){
        res.status(404).json({ error: 'ユーザーが見つかりません' });
        return ;
    }
    res.json({ message: '削除しました', user: result.rows[0] });
});

app.listen(3000, () => {
    console.log('Server runnning on port 3000');
});