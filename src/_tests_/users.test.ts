import request from "supertest";
import { app } from "../app";
import { pool } from "../db";


describe("認証付き /users API", () => {
    it("signup → login → GET /users で一覧取得できるか", async () => {
        const email = `users-${Date.now()}@example.cpm`;
        const password = "password123";

        //テストユーザー作成
        const signupRes = await request(app)
            .post('/auth/signup')
            .send({
                name: 'user-test',
                email,
                password,
            });

        expect(signupRes.status).toBe(201);
        const createdUser = signupRes.body;
        expect(createdUser).toHaveProperty("id");

        //ログインしてトークン取得
        const loginRes = await request(app)
         .post('/auth/login')
         .send({ email, password });

        expect(loginRes.status).toBe(200);
        const token = loginRes.body.token;
        expect(typeof token).toBe("string");

        //トークン付きで GET userたたく
        const listRes = await request(app)
         .get('/users')
         .set("Authorization", `Bearer ${token}`);

        expect(listRes.status).toBe(200);
        expect(Array.isArray(listRes.body)).toBe(true);

        //作成したuserが一覧に含まれてるかざっくり確認
        const users = listRes.body as Array<{ id: Number; email: string }>;
        const found = users.some((u) => u.id === createdUser.id && u.email === email);

        expect(found).toBe(true);
    });

    it("GET /users/:id で指定したユーザー詳細が取得できるか", async () => {
        const email = `user-detail-${Date.now()}@example.com`;
        const password = "password123";

        //ユーザー作成
        const signupRes = await request(app)
         .post("/auth/signup")
         .send({
            name: "user-detail",
            email,
            password,
         });

        expect(signupRes.status).toBe(201);
        const createdUser = signupRes.body;

        //loginしてトークン取得
        const loginRes = await request(app)
         .post('/auth/login')
         .send({ email, password });

        expect(loginRes.status).toBe(200);
        const token = loginRes.body.token;

        //GET /users/:id たたく
        const detailRes = await request(app)
         .get(`/users/${createdUser.id}`)
         .set("Authorization", `Bearer ${ token }`);

         expect(detailRes.status).toBe(200);
         expect(detailRes.body).toMatchObject({
            id: createdUser.id,
            name: "user-detail",
            email,
         });
    });

    it("トークンなしで GET /users叩くと401になるか", async () => {
        const res = await request(app).get("/users");
        expect(res.status).toBe(401);
        expect(res.body).toMatchObject({ error: "トークンがありません" });
    });
});

afterAll(async () => {
    await pool.end();
});