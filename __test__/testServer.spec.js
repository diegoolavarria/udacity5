import app from "../src/server";
import supertest from "supertest";

const request = supertest(app);

describe("Testing the server", () => {
  test("Testing endpoint: ", async (done) => {
    const res = await request.get("/test");
    expect(res.status).toBe(200);
    done();
  });
});
