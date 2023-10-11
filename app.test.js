const supertest = require("supertest");
const { MongoClient } = require("mongodb");
const app = require("./server");

describe("POST /login", () => {
  describe("given an username and a password", () => {
    test("should respond with a 200 status code", async () => {
      const response = await supertest(app).post("/login").send({
        loginEmail: "ad",
        loginPassword: "admin",
      });
      expect(response.statusCode).toBe(200);
    });

    test("should specify json in the content type header", async () => {
      const response = await supertest(app).post("/login").send({
        loginEmail: "ad",
        loginPassword: "admin",
      });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("should respond with the message: User found", async () => {
      const response = await supertest(app).post("/login").send({
        loginEmail: "ad",
        loginPassword: "admin",
      });
      expect(response.body.message).toBe("User found");
    });
  });
});
