const path = require('path');
const backup = require('../cron/backup');
const UserModels = require('../models/UserModels');

const BackupController = {

  /* ====== ADMIN BACKUP MANAGEMENT ====== */
  getAdminBackups: async (req, res) => {
    try {
      const backups = backup.listBackups();
      const stats = backup.getBackupStats();
      const adminData = req.user ? req.user.mail : null;
      res.render('pages/admin-backups', { backups, stats, adminData, messages: req.query });
    } catch (err) {
      console.error('Admin backups page error:', err);
      res.redirect('/admin');
    }
  },

  triggerManualBackup: async (req, res) => {
    try {
      await backup.runFullBackup();
      res.redirect('/admin/backups?backup_ok=true');
    } catch (err) {
      console.error('Manual backup error:', err);
      res.redirect('/admin/backups?backup_err=true');
    }
  },

  downloadBackup: async (req, res) => {
    try {
      const { file } = req.params;
      const safePath = path.resolve(backup.backupDir, path.basename(file));
      if (!safePath.startsWith(path.resolve(backup.backupDir))) {
        return res.status(403).send('Invalid path');
      }
      res.download(safePath);
    } catch (err) {
      console.error('Download backup error:', err);
      res.redirect('/admin/backups?error=true');
    }
  },

  deleteBackup: async (req, res) => {
    try {
      const { file } = req.params;
      backup.deleteBackup(path.basename(file));
      res.redirect('/admin/backups?deleted=true');
    } catch (err) {
      console.error('Delete backup error:', err);
      res.redirect('/admin/backups?error=true');
    }
  },

  /* ====== SHOPKEEPER EXPORT ====== */
  getExportPage: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const shopkeeperData = await UserModels.workermailCatchM(shopEmail);
      res.render('pages/pharmacy/export', { shopkeeperData, messages: req.query });
    } catch (err) {
      console.error('Export page error:', err);
      res.redirect('/pharmacy/dashboard');
    }
  },

  exportJson: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const data = await backup.shopkeeperExportJson(shopEmail);
      const shopname = data.shop ? data.shop.shopname.replace(/[^a-zA-Z0-9]/g, '_') : 'export';
      const filename = `${shopname}_export_${new Date().toISOString().slice(0, 10)}.json`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/json');
      res.json(data);
    } catch (err) {
      console.error('Export JSON error:', err);
      res.redirect('/pharmacy/export?error=true');
    }
  },

  exportCsv: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const { type } = req.params;
      const data = await backup.shopkeeperExportJson(shopEmail);

      const def = backup.csvDefinitions[type];
      if (!def) return res.status(404).send('Invalid export type');

      let rows;
      switch (type) {
        case 'suppliers': rows = data.suppliers || []; break;
        case 'purchases': rows = data.purchases || []; break;
        case 'purchase-items':
          rows = [];
          (data.purchase_items || []).forEach(pi => {
            (pi.items || []).forEach(item => {
              rows.push({ ...item, purchase_id: pi.purchase_id });
            });
          });
          break;
        case 'sales': rows = data.sales || []; break;
        case 'sale-items':
          rows = [];
          (data.sale_items || []).forEach(si => {
            (si.items || []).forEach(item => {
              rows.push({ ...item, sale_id: si.sale_id });
            });
          });
          break;
        case 'expenses': rows = data.expenses || []; break;
        case 'inventory': rows = data.inventory || []; break;
        default: return res.status(404).send('Invalid export type');
      }

      const csv = backup.generateCsv(rows, def.columns);
      res.setHeader('Content-Disposition', `attachment; filename="${def.filename}"`);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.send('\uFEFF' + csv);
    } catch (err) {
      console.error('Export CSV error:', err);
      res.redirect('/pharmacy/export?error=true');
    }
  },
};

module.exports = BackupController;
