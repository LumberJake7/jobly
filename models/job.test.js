"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "new",
    salary: 100,
    equity: "0.1",
    companyHandle: "c1",
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    // Convert equity to string to match the expected value
    job.equity = job.equity.toString();
    expect(job).toEqual({
      ...newJob,
      id: expect.any(Number),
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE title = 'new'`
    );
    // Convert equity to string to match the expected value
    result.rows[0].equity = result.rows[0].equity.toString();
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        title: "new",
        salary: 100,
        equity: "0.1",
        company_handle: "c1",
      },
    ]);
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    // Convert equity to string to match the expected values
    jobs.forEach((job) => {
      if (job.equity !== null) job.equity = job.equity.toString();
    });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "J1",
        salary: 10000,
        equity: "0.1",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "J2",
        salary: 20000,
        equity: "0.2",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "J3",
        salary: 30000,
        equity: null,
        companyHandle: "c2",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(1);
    // Convert equity to string to match the expected value
    job.equity = job.equity.toString();
    expect(job).toEqual({
      id: 1,
      title: "J1",
      salary: 10000,
      equity: "0.1",
      companyHandle: "c1",
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New",
    salary: 10,
    equity: "0.5",
  };

  test("works", async function () {
    let job = await Job.update(1, updateData);
    // Convert equity to string to match the expected value
    job.equity = job.equity.toString();
    expect(job).toEqual({
      id: 1,
      companyHandle: "c1",
      ...updateData,
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE id = 1`
    );
    // Convert equity to string to match the expected value
    result.rows[0].equity = result.rows[0].equity.toString();
    expect(result.rows).toEqual([
      {
        id: 1,
        title: "New",
        salary: 10,
        equity: "0.5",
        company_handle: "c1",
      },
    ]);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(9999, {
        title: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query("SELECT id FROM jobs WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
