import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';

function getBoolEnv(name, def = false) {
  const v = process.env[name];
  if (v === undefined) return def;
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());
}

function getEnv(name, def) {
  const v = process.env[name];
  if (v === undefined || v === '') {
    if (def !== undefined) return def;
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

function buildConfig() {
  const host = getEnv('MYSQL_HOST');
  const port = Number(getEnv('MYSQL_PORT', '3306'));
  const user = getEnv('MYSQL_USER');
  const password = getEnv('MYSQL_PASSWORD');
  const database = getEnv('MYSQL_DATABASE');
  const sslEnabled = getBoolEnv('MYSQL_SSL', false);
  const sslNoVerify = getBoolEnv('MYSQL_SSL_NO_VERIFY', false);

  const cfg = {
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true,
    connectTimeout: 15000,
  };

  if (sslEnabled) {
    cfg.ssl = { rejectUnauthorized: !sslNoVerify };
  }

  return cfg;
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--query' || a === '-q') {
      args.query = argv[++i];
    } else if (a === '--file' || a === '-f') {
      args.file = argv[++i];
    } else if (a === '--test' || a === '-t') {
      args.test = true;
    } else if (a === '--json') {
      args.json = true;
    } else if (a === '--help' || a === '-h') {
      args.help = true;
    } else {
      args._.push(a);
    }
  }
  return args;
}

function printHelp() {
  const help = `Usage: node scripts/mysql-cli.mjs [--test] [--query "SQL"] [--file path.sql] [--json]

Env vars (required):
  MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
Optional:
  MYSQL_SSL=true          Enable TLS
  MYSQL_SSL_NO_VERIFY=1   Skip TLS certificate verification (if needed)

Examples:
  node scripts/mysql-cli.mjs --test
  node scripts/mysql-cli.mjs --query "SELECT NOW() as now"
  node scripts/mysql-cli.mjs --file ./seed.sql
`;
  process.stdout.write(help);
}

function printRows(rows, json) {
  if (json) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }
  if (!Array.isArray(rows)) {
    console.log(rows);
    return;
  }
  if (rows.length === 0) {
    console.log('(no rows)');
    return;
  }
  const cols = Object.keys(rows[0]);
  const widths = cols.map(c => Math.max(c.length, ...rows.map(r => String(r[c] ?? '').length)));
  const sep = '+' + widths.map(w => '-'.repeat(w + 2)).join('+') + '+';
  const header = '|' + cols.map((c, i) => ' ' + c.padEnd(widths[i]) + ' ').join('|') + '|';
  console.log(sep);
  console.log(header);
  console.log(sep);
  for (const r of rows) {
    const line = '|' + cols.map((c, i) => ' ' + String(r[c] ?? '').padEnd(widths[i]) + ' ').join('|') + '|';
    console.log(line);
  }
  console.log(sep);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }

  const cfg = buildConfig();
  const conn = await mysql.createConnection(cfg);
  try {
    if (args.test) {
      const [rows] = await conn.query('SELECT DATABASE() as db, VERSION() as version, NOW() as now');
      console.log('Connected successfully.');
      printRows(rows, args.json);
      return;
    }
    if (args.query) {
      const [rows] = await conn.query(args.query);
      printRows(rows, args.json);
      return;
    }
    if (args.file) {
      const abs = path.resolve(process.cwd(), args.file);
      const sql = fs.readFileSync(abs, 'utf8');
      const [rows] = await conn.query(sql);
      printRows(rows, args.json);
      return;
    }
    printHelp();
  } finally {
    await conn.end();
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  if (err.code) console.error('Code:', err.code);
  process.exitCode = 1;
});
