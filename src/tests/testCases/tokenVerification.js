const createJWKSMock = require("mock-jwks").createJWKSMock();
const { TokenExpiredError } = require("jsonwebtoken");
const { expect } = require("chai");
const given = require('../steps/given');

describe("Auth Test", () => {
  const jwks = createJWKSMock("https://dev-f8ud0irk.eu.auth0.com/");

  before(() => {
    jwks.start();
  });

  after(() => {
    jwks.stop();
  });

  it("should verify the token", async () => {
    const token = jwks.token({});

    const data = await given.verifyAuth0Token(token);

    expect(data).to.equal({});
    console.log(`should verify the token: ${data}`);
  });

  it("should be an invalid token", async () => {
    // expect.assertions(1);
    const token = jwks.token({
      exp: 0,
    });

    try {
      const data = await given.verifyAuth0Token(token);
    } catch (error) {
      expect(error).to.equal(new TokenExpiredError("jwt expired"));
    }
  });
});
