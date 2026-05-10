const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const dbConnect = require('../config/database');
require('dotenv').config();

const backupDir = path.resolve(process.env.BACKUP_DIR || './backups');
const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;

function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function timestamp() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

async function runFullBackup() {
  return new Promise((resolve, reject) => {
    ensureBackupDir();
    const filename = `emergency_medicine_${timestamp()}.sql.gz`;
    const filepath = path.join(backupDir, filename);

    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const pass = process.env.DB_PASS || '';
    const db = process.env.DB_NAME || 'emergency_medicine';

    const mysqldump = process.platform === 'win32' ? 'mysqldump' : 'mysqldump';
    const cmd = `${mysqldump} --host=${host} --user=${user} ${pass ? `--password=${pass}` : ''} ${db} | gzip > "${filepath}"`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error('Backup failed:', err.message);
        return reject(err);
      }
      console.log(`Backup created: ${filename}`);
      cleanupOldBackups();
      resolve({ filename, filepath });
    });
  });
}

async function listBackups() {
  ensureBackupDir();
  try {
    const files = fs.readdirSync(backupDir);
    const backups = files
      .filter(f => f.endsWith('.sql.gz'))
      .map(f => {
        const stat = fs.statSync(path.join(backupDir, f));
        return {
          filename: f,
          size: stat.size,
          sizeFormatted: formatSize(stat.size),
          date: stat.mtime,
          dateFormatted: stat.mtime.toLocaleString(),
        };
      })
      .sort((a, b) => b.date - a.date);
    return backups;
  } catch (err) {
    console.error('List backups error:', err);
    return [];
  }
}

function deleteBackup(filename) {
  ensureBackupDir();
  const filepath = path.join(backupDir, filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    return true;
  }
  return false;
}

function cleanupOldBackups() {
  ensureBackupDir();
  try {
    const files = fs.readdirSync(backupDir);
    const now = Date.now();
    files.filter(f => f.endsWith('.sql.gz')).forEach(f => {
      const filepath = path.join(backupDir, f);
      const stat = fs.statSync(filepath);
      const ageDays = (now - stat.mtimeMs) / (1000 * 60 * 60 * 24);
      if (ageDays > retentionDays) {
        fs.unlinkSync(filepath);
        console.log(`Deleted old backup: ${f}`);
      }
    });
  } catch (err) {
    console.error('Cleanup error:', err);
  }
}

function getBackupStats() {
  const backups = listBackups();
  const totalSize = backups.reduce((sum, b) => sum + b.size, 0);
  return {
    count: backups.length,
    totalSizeFormatted: formatSize(totalSize),
    lastBackup: backups.length > 0 ? backups[0].dateFormatted : 'Never',
  };
}

async function shopkeeperExportJson(shopEmail) {
  const queries = {
    shop: 'SELECT shopname, email, phone, division, zila, upazila, lat, lng FROM worker WHERE email = ?',
    suppliers: 'SELECT * FROM suppliers WHERE shop_email = ? ORDER BY name',
    purchases: `SELECT p.*, s.name as supplier_name FROM purchases p LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id WHERE p.shop_email = ? ORDER BY p.purchase_date DESC`,
    sales: 'SELECT * FROM sales WHERE shop_email = ? ORDER BY sale_date DESC',
    expenses: `SELECT e.*, ec.name as category_name FROM expenses e JOIN expense_categories ec ON e.category_id = ec.category_id WHERE e.shop_email = ? ORDER BY e.expense_date DESC`,
    inventory: 'SELECT * FROM shopmedicine WHERE shop_email = ? ORDER BY mediname',
  };

  const data = { exported_at: new Date().toISOString(), shop: null };
  for (const [key, sql] of Object.entries(queries)) {
    const [rows] = await dbConnect.promise().execute(sql, [shopEmail]);
    data[key] = rows;
    if (key === 'shop' && rows.length > 0) data.shop = rows[0];
  }

  const purchaseItems = [];
  for (const p of (data.purchases || [])) {
    const [items] = await dbConnect.promise().execute('SELECT * FROM purchase_items WHERE purchase_id = ?', [p.purchase_id]);
    purchaseItems.push({ purchase_id: p.purchase_id, items });
  }
  data.purchase_items = purchaseItems;

  const saleItems = [];
  for (const s of (data.sales || [])) {
    const [items] = await dbConnect.promise().execute('SELECT * FROM sale_items WHERE sale_id = ?', [s.sale_id]);
    saleItems.push({ sale_id: s.sale_id, items });
  }
  data.sale_items = saleItems;

  return data;
}

function toCsvRow(obj, columns) {
  return columns.map(col => {
    const val = obj[col];
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }).join(',');
}

function generateCsv(dataArray, columns) {
  const header = columns.join(',');
  const rows = dataArray.map(row => toCsvRow(row, columns));
  return [header, ...rows].join('\r\n');
}

const csvDefinitions = {
  suppliers: {
    columns: ['supplier_id', 'name', 'company', 'email', 'phone', 'address', 'city', 'created_at'],
    filename: 'suppliers.csv',
  },
  purchases: {
    columns: ['purchase_id', 'supplier_id', 'supplier_name', 'invoice_no', 'purchase_date', 'subtotal', 'discount', 'vat', 'total_amount', 'paid_amount', 'due_amount', 'payment_status', 'notes'],
    filename: 'purchases.csv',
  },
  'purchase-items': {
    columns: ['item_id', 'purchase_id', 'medicine_name', 'batch_no', 'expiry_date', 'quantity', 'unit_price', 'mrp', 'total'],
    filename: 'purchase_items.csv',
  },
  sales: {
    columns: ['sale_id', 'invoice_no', 'sale_date', 'customer_name', 'customer_phone', 'subtotal', 'discount', 'vat', 'total_amount', 'paid_amount', 'due_amount', 'profit_amount', 'payment_method', 'sale_type'],
    filename: 'sales.csv',
  },
  'sale-items': {
    columns: ['item_id', 'sale_id', 'medicine_name', 'batch_no', 'quantity', 'unit_price', 'cost_price', 'mrp', 'total', 'profit'],
    filename: 'sale_items.csv',
  },
  expenses: {
    columns: ['expense_id', 'category_id', 'category_name', 'description', 'amount', 'expense_date', 'payment_method', 'reference_no'],
    filename: 'expenses.csv',
  },
  inventory: {
    columns: ['id', 'mediname', 'meditype', 'medistrength', 'medigeneric', 'medicompany', 'stock', 'price'],
    filename: 'inventory.csv',
  },
};

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

module.exports = {
  runFullBackup,
  listBackups,
  deleteBackup,
  getBackupStats,
  shopkeeperExportJson,
  generateCsv,
  csvDefinitions,
  backupDir,
};
