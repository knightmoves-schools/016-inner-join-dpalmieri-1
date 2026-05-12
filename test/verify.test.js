const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const assert = require('assert');
function runScript(db, script) {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
const getAllFromEmployee = (db) => {
  const sql = `SELECT * FROM Employee`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
const getAllFromContactInfo = (db) => {
  const sql = `SELECT * FROM Contact_Info`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if(err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
const buildEmployeeContactInfo = (employees, contactInfos) => {
  let employeeContactInfo = [];
  employees.forEach((employee) => {
    contactInfo = contactInfos.find((info) => info.ID === employee.ID)
    employeeContactInfo.push({
      NAME: employee.NAME,
      ADDRESS: contactInfo.ADDRESS,
      EMAIL: contactInfo.EMAIL
    });
  });
  return employeeContactInfo;
}
describe('the SQL in the `exercise.sql` file', () => {
  let db;
  let scriptPath;
  beforeAll(() => {
    const dbPath = path.resolve(__dirname, '..', 'lesson16.db');
    db = new sqlite3.Database(dbPath);
    scriptPath = path.resolve(__dirname, '..', 'exercise.sql');
  });
  afterAll(() => {
    db.close();
  });

it('Should select the name from the `Employee` and the address and email from the `Contact_Info` and inner join them', async () => {
    const results = await runScript(db, scriptPath);
    const employees = await getAllFromEmployee(db);
    const contactInfos = await getAllFromContactInfo(db);
    const expected = buildEmployeeContactInfo(employees, contactInfos);
    results.sort();
    expected.sort();
    expect(results).toEqual(expected);
  });
});
