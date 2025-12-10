import request from "supertest";
import { app } from "../app";
import { pool } from "../db";


describe("POST /auth/signup", () => {
    it("正しい入力ならユーザー登録できること", async () => {

        //毎回ユニークなメールアドレスを使う
        const email = `signup-${Date.now()}@example.com`;

        //ユーザー作成
        const res = await request(app)
          .post("/auth/signup")
          .send({
            name: "signup-user",
            email,
            password: "password123",
        });

    //ステータスコード
    expect(res.status).toBe(201);

    //パスは返さない
    expect(res.body).toHaveProperty("id");
    expect(res.body).toMatchObject({
        name: "signup-user",
        email,
    });
    expect(res.body).not.toHaveProperty("password");
    });
});

describe("POST /auth/login", () => {
    it("正しいメール・パスワードならトークンが返ること", async () => {
        const email = `login-${Date.now()}@example.com`
        const password = "password123";

        //先にサインアップしてユーザーを作っておく
        await request(app)
        .post("/auth/signup")
        .send({
            name: "login-user",
            email,
            password,
        });

        //そのあとログイン
        const res = await request(app)
        .post("/auth/login")
        .send({ email, password });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toBe("string");
    });
});

afterAll(async () => {
    await pool.end();
});