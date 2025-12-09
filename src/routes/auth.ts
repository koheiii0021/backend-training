import { pool } from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Router, Request, Response } from "express";
import { resolveObjectURL } from "buffer";

const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

if(!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
}

//signup
authRouter.post('/signup', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            res.status(400).json({ error: 'name, email, passwordは必須です' });
            return ;
        }

        const mailCheck = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        )

        if(mailCheck.rows.length > 0){
            res.status(401).json({ error: 'メールアドレスは使われてます' });
            return ;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        )

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Signup error', err);
        res.status(500).json({ error:'サーバーエラーが発生しました' });
    }
});

//login
authRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            res.status(400).json({ error: 'email, passwordは必須です' });
            return ;
        }

        const result = await pool.query(
            'SELCET id FROM users WHERE email = $1',
            [email]
        )

        if(result.rows.length === 0){
            res.status(401).json({ error: 'メールアドレスまたはパスワードが間違っています' });
            return ;
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            res.status(401).json({ error: 'メールアドレスまたはパスワードが間違っています' });
            return ;
        }

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            JWT_SECRET,
            { expiresIn: "24h"}
        );

        res.status(201).json({ token });
    } catch (err) {
        console.error('Login error', err);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
});