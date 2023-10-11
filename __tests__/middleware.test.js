const jwt = require("jsonwebtoken");
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");

jest.mock("jsonwebtoken");

describe("Authentication middleware", () => {
  it("should verify the token and call next() if token is valid", () => {
    const req = {
      cookies: {
        token: "validToken",
      },
    };
    res = {};
    next = jest.fn();

    jwt.verify.mockImplementationOnce((token, key, callback) => {
      const decoded = {
        user: {
          name: "testname",
          email: "testemail",
          id: "testid",
        },
      };
      callback(null, decoded);
    });
    cookieJwtAuth(req, res, next);
    expect(req.user).toEqual({
      name: "testname",
      email: "testemail",
      id: "testid",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should clear cookie and redirect to /login if token is invalid", () => {
    const req = {
      cookies: {
        token: "invalidToken",
      },
    };
    const res = {
      clearCookie: jest.fn(),
      redirect: jest.fn(),
    };
    const next = jest.fn();

    jwt.verify.mockImplementationOnce((token, key, callback) => {
      const err = new Error("Invalid token");
      callback(err, null);
    });

    cookieJwtAuth(req, res, next);

    expect(res.clearCookie).toHaveBeenCalledWith("token");
    expect(res.redirect).toHaveBeenCalledWith("/login");
    expect(next).not.toHaveBeenCalled();
  });
});
