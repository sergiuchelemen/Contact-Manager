const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config();

// port changed due to ports conflict
process.env.PORT = "3001";
const app = require("../server");

jest.mock("../connectDatabase", () => jest.fn());

jest.mock("../models/contactModel", () => ({
  create: jest.fn(),
  deleteOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
}));

jest.mock("../middlewares/cookieJwtAuth", () => {
  return jest.fn((req, res, next) => {
    req.user = {
      name: "testname",
      email: "testemail",
      id: "testid",
    };
    next();
  });
});

const mockedContact = {
  firstname: "testfirstname",
  lastname: "testlastname",
  email: "testmail",
  phone: "testphone",
  user_id: "testid",
};

const mockCreate = jest.requireMock("../models/contactModel").create;
const mockDelete = jest.requireMock("../models/contactModel").deleteOne;
const mockUpdate = jest.requireMock("../models/contactModel").findOneAndUpdate;

mockCreate.mockResolvedValue(mockedContact);
mockDelete.mockResolvedValue(mockedContact);
mockUpdate.mockResolvedValue(mockedContact);

describe("POST /add", () => {
  it("should respond with a 201 status code and 'User added' message if contact is created", async () => {
    mockCreate.mockResolvedValue(mockedContact);
    const response = await request(app).post("/user/add").send({
      firstname: "testfirstname",
      lastname: "testlastname",
      email: "testmail",
      phone: "testphone",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User added");
  });

  it("should respond with a 500 status code and 'Internal server error if user isn't created", async () => {
    mockCreate.mockResolvedValue(null);
    const response = await request(app).post("/user/add").send({
      firstname: "testfirstname",
      lastname: "testlastname",
      email: "testmail",
      phone: "testphone",
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });
});

describe("DELETE /user", () => {
  it("should respond with a 201 status code and 'User deleted' message if contact is created", async () => {
    const response = await request(app).delete("/user").send({
      firstname: "testfirstname",
      lastname: "testlastname",
      email: "testmail",
      phone: "testphone",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted");
  });

  it("should respond with a 500 status code and 'Internal server error' message if contact isn't created", async () => {
    mockDelete.mockResolvedValue(null);
    const response = await request(app).delete("/user").send({
      firstname: "testfirstname",
      lastname: "testlastname",
      email: "testmail",
      phone: "testphone",
    });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });
});

describe("PUT /user", () => {
  it("should respond with a 200 status code and 'User modfied' message if contact is updated", async () => {
    const mockRequestData = {
      currentData: {
        firstname: "existingFirstName",
        lastname: "existingLastName",
        email: "existing@example.com",
        phone: "1234567890",
      },
      modifiedData: {
        firstname: "modifiedFirstName",
        lastname: "modifiedLastName",
        email: "modified@example.com",
        phone: "9876543210",
      },
    };
    const response = await request(app).put("/user").send(mockRequestData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User modified");
  });

  it("should respond with a 500 status code and 'Internal server error' message if contact isn't updated", async () => {
    mockUpdate.mockResolvedValue(null);
    const mockRequestData = {
      currentData: {
        firstname: "existingFirstName",
        lastname: "existingLastName",
        email: "existing@example.com",
        phone: "1234567890",
      },
      modifiedData: {
        firstname: "modifiedFirstName",
        lastname: "modifiedLastName",
        email: "modified@example.com",
        phone: "9876543210",
      },
    };
    const response = await request(app).put("/user").send(mockRequestData);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });
});
