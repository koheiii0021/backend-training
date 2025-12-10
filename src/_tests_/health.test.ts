import request from "supertest";
import { app } from "../app";

describe("GET /health", () => {
    it("200 が返って status: ok になること", async () => {
        const res = await request(app).get("/health");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "ok" });
    });
});

