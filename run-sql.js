const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

async function runSQL(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const statements = sql.split(';').filter(s => s.trim().length > 0);

  const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: true,
  });

  conn.query(sql, (err, results) => {
    if (err) {
      console.error('Error:', err.message);
      process.exit(1);
    }
    console.log(`✅ ${filePath} executed successfully`);
    if (Array.isArray(results)) {
      results.forEach(r => {
        if (Array.isArray(r) && r.length > 0 && r[0].message) console.log(`   ${r[0].message}`);
        if (Array.isArray(r) && r.length > 0 && r[0].info) console.log(`   ${r[0].info}`);
      });
    }
    conn.end();
  });
}

const file = process.argv[2];
if (!file) {
  console.log('Usage: node run-sql.js <file.sql>');
  process.exit(1);
}
runSQL(file);
