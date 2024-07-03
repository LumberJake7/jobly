"use strict";

const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // Clear existing entries
  await db.query("DELETE FROM applications");
  await db.query("DELETE FROM jobs");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM companies");

  // Insert companies
  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  // Insert users
  await db.query(
    `
    INSERT INTO users(username, password, first_name, last_name, email, is_admin)
    VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com', false),
           ('u2', $2, 'U2F', 'U2L', 'u2@email.com', true)`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );

  // Insert jobs
  await db.query(`
  INSERT INTO jobs (id, title, salary, equity, company_handle)
  VALUES (1, 'J1', 10000, '0.1', 'c1'),
         (2, 'J2', 20000, '0.2', 'c1'),
         (3, 'J3', 30000, NULL, 'c2')`);

  // Insert applications
  await db.query(`
    INSERT INTO applications (job_id, username)
    VALUES (1, 'u1')`);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
};
