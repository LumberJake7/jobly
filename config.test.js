"use strict";

describe("config can come from env", function () {
  test("works", function () {
    process.env.SECRET_KEY = "abc";
    process.env.PORT = "5000";
    process.env.DATABASE_URL = "other";
    process.env.NODE_ENV = "other";

    const config = require("./config");
    expect(config.SECRET_KEY).toEqual("abc");
    expect(config.PORT).toEqual(5000);
    expect(config.getDatabaseUri()).toEqual("other");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

    delete process.env.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.BCRYPT_WORK_FACTOR;
    delete process.env.DATABASE_URL;

    // Change 'user' to match the the current
    expect(config.getDatabaseUri()).toEqual(
      "postgresql://jake:password@localhost:5432/jobly"
    );

    process.env.NODE_ENV = "test";

    // Update the expected value to match the format your configuration uses
    expect(config.getDatabaseUri()).toEqual("postgresql:///jobly_test");
  });
});
