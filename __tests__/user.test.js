const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config();

// port changed due to ports conflict
process.env.PORT = "3002";
const app = require("../server");
jest.mock("../connectDatabase", () => jest.fn());

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("../models/userModel", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

const mockCompare = jest.requireMock("bcrypt").compare;
const mockHash = jest.requireMock("bcrypt").hash;
const mockSign = jest.requireMock("jsonwebtoken").sign;
const mockUserModel = jest.requireMock("../models/userModel").findOne;

describe("POST /login", () => {
  const mockedUser = {
    _id: "someUserId",
    name: "Test User",
    email: "test@example.com",
    password: "$2b$10$0K7kvN.uP3MP1i2JxgElke/n0hKcX7brJ.gxD2VZf0o9P3P8LIt0C",
  };

  mockCompare.mockReturnValue(true);
  mockHash.mockReturnValue("hashedPassword");
  mockSign.mockReturnValue("mockedToken");
  mockUserModel.mockResolvedValue(mockedUser);
  it("should respond with the 200 status code", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", loginPassword: "password123" });
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  it("should respond with the 404 status code", async () => {
    mockUserModel.mockResolvedValue(null);
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", loginPassword: "password123" });
    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  it("should respond with the right message for user not found", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", loginPassword: "password123" });
    expect(response.body.message).toBe("User not found");
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  it("should respond with the right message for user found", async () => {
    mockUserModel.mockResolvedValue(mockedUser);
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", loginPassword: "password123" });
    expect(response.body.message).toBe("User found");
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  it("should decrypt the password", async () => {
    mockUserModel.mockResolvedValue(mockedUser);
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", loginPassword: "password123" });
    expect(mockCompare).toHaveBeenCalledWith(
      "password123",
      mockedUser.password
    );
  });

  it("should sign the jwt token with the user data", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", loginPassword: "password123" });
    expect(mockSign).toHaveBeenCalledWith(
      {
        user: {
          name: mockedUser.name,
          email: mockedUser.email,
          id: mockedUser.id,
        },
      },
      process.env.ACCESS_KEY,
      { expiresIn: "1h" }
    );
  });
});

describe("POST /register", () => {
  const mockedUser = {
    _id: "someUserId",
    name: "Test User",
    email: "test@example.com",
    password: "$2b$10$0K7kvN.uP3MP1i2JxgElke/n0hKcX7brJ.gxD2VZf0o9P3P8LIt0C",
  };

  it("should respond with the 201 status code", async () => {
    mockUserModel.mockResolvedValue(null);
    const response = await request(app).post("/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(response.status).toBe(201);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  it("should respond with the rigth message for creating a new user", async () => {
    const response = await request(app).post("/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(response.body.message).toBe("User created");
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  it("should respond with the 409 status code", async () => {
    mockUserModel.mockResolvedValue(mockedUser);
    const response = await request(app).post("/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(response.status).toBe(409);
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  it("should respond with the rigth message for existing user", async () => {
    const response = await request(app).post("/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(response.body.message).toBe("User already exists");
    expect(response.headers["content-type"]).toEqual(
      expect.stringContaining("json")
    );
  });

  it("should encrypt the user password", async () => {
    const response = await request(app).post("/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(mockHash).toHaveBeenCalledWith("password123", 10);
  });
});
