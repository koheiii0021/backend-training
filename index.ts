import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: Function ) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req: Request, res: Response ) => {
    res.send('Hello World');
});

app.get('/users', (req: Request, res: Response ) => {
    res.json({
        message: "ユーザー一覧"
    });
});

app.post('/users', (req: Request, res: Response ) => {
    const body = req.body;

    if(!body.name){
        res.status(400).json({ error: "nameは必須です" });
        return ;
    };

    res.status(201).json({
        message: "ユーザー作成しました",
        data: body
    });
});

app.get('/users/:id', (req: Request, res: Response ) => {
    const userId = req.params.id;
    res.json({
        id: userId,
        name: "田中太郎"
    });
});

app.listen(3000, () => {
    console.log('Server runnning on port 3000');
});