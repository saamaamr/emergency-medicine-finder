const UserModels = require('../models/UserModels');

const PharmacyController = {

  /* ====== DASHBOARD ====== */
  getDashboard: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const [shopkeeperData, summary, lowStock, recentSales, recentPurchases] = await Promise.all([
        UserModels.workermailCatchM(shopEmail),
        UserModels.getDashboardSummary(shopEmail),
        UserModels.getLowStockMedicines(shopEmail, 10),
        UserModels.getAllSales(shopEmail),
        UserModels.getAllPurchases(shopEmail),
      ]);
      res.render('pages/pharmacy/dashboard', {
        shopkeeperData, summary, lowStock,
        recentSales: recentSales.slice(0, 5),
        recentPurchases: recentPurchases.slice(0, 5),
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      res.redirect('/shopkeeperdesh');
    }
  },

  /* ====== SUPPLIERS ====== */
  getSuppliers: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const [shopkeeperData, suppliers] = await Promise.all([
        UserModels.workermailCatchM(shopEmail),
        UserModels.getAllSuppliers(shopEmail),
      ]);
      res.render('pages/pharmacy/suppliers', { shopkeeperData, suppliers, messages: req.query });
    } catch (err) {
      console.error('Suppliers error:', err);
      res.redirect('/shopkeeperdesh');
    }
  },

  addSupplier: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const { name, company, email, phone, address, city } = req.body;
      await UserModels.createSupplier(shopEmail, name, company, email, phone, address, city);
      res.redirect('/pharmacy/suppliers?added=true');
    } catch (err) {
      console.error('Add supplier error:', err);
      res.redirect('/pharmacy/suppliers?error=true');
    }
  },

  updateSupplier: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const { id } = req.params;
      const { name, company, email, phone, address, city } = req.body;
      await UserModels.updateSupplier(id, shopEmail, name, company, email, phone, address, city);
      res.redirect('/pharmacy/suppliers?updated=true');
    } catch (err) {
      console.error('Update supplier error:', err);
      res.redirect('/pharmacy/suppliers?error=true');
    }
  },

  deleteSupplier: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const { id } = req.params;
      await UserModels.deleteSupplier(id, shopEmail);
      res.redirect('/pharmacy/suppliers?deleted=true');
    } catch (err) {
      console.error('Delete supplier error:', err);
      res.redirect('/pharmacy/suppliers?error=true');
    }
  },

  /* ====== EXPENSES ====== */
  getExpenses: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const [shopkeeperData, expenses, categories] = await Promise.all([
        UserModels.workermailCatchM(shopEmail),
        UserModels.getAllExpenses(shopEmail),
        UserModels.getAllExpenseCategories(shopEmail),
      ]);
      res.render('pages/pharmacy/expenses', { shopkeeperData, expenses, categories, messages: req.query });
    } catch (err) {
      console.error('Expenses error:', err);
      res.redirect('/shopkeeperdesh');
    }
  },

  addExpense: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const { category_id, description, amount, expense_date, payment_method, reference_no } = req.body;
      await UserModels.createExpense(shopEmail, category_id, description, amount, expense_date, payment_method, reference_no);
      res.redirect('/pharmacy/expenses?added=true');
    } catch (err) {
      console.error('Add expense error:', err);
      res.redirect('/pharmacy/expenses?error=true');
    }
  },

  updateExpense: async (req, res) => {
    try {
      const { id } = req.params;
      const { category_id, description, amount, expense_date, payment_method, reference_no } = req.body;
      await UserModels.updateExpense(id, category_id, description, amount, expense_date, payment_method, reference_no);
      res.redirect('/pharmacy/expenses?updated=true');
    } catch (err) {
      console.error('Update expense error:', err);
      res.redirect('/pharmacy/expenses?error=true');
    }
  },

  deleteExpense: async (req, res) => {
    try {
      await UserModels.deleteExpense(req.params.id);
      res.redirect('/pharmacy/expenses?deleted=true');
    } catch (err) {
      console.error('Delete expense error:', err);
      res.redirect('/pharmacy/expenses?error=true');
    }
  },

  addExpenseCategory: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const { name, type } = req.body;
      await UserModels.createExpenseCategory(shopEmail, name, type);
      res.redirect('/pharmacy/expenses?cat_added=true');
    } catch (err) {
      console.error('Add category error:', err);
      res.redirect('/pharmacy/expenses?error=true');
    }
  },

  /* ====== PURCHASES ====== */
  getPurchases: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const [shopkeeperData, purchases, suppliers] = await Promise.all([
        UserModels.workermailCatchM(shopEmail),
        UserModels.getAllPurchases(shopEmail),
        UserModels.getAllSuppliers(shopEmail),
      ]);
      res.render('pages/pharmacy/purchases', { shopkeeperData, purchases, suppliers, messages: req.query });
    } catch (err) {
      console.error('Purchases error:', err);
      res.redirect('/shopkeeperdesh');
    }
  },

  getPurchaseAdd: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const [shopkeeperData, suppliers, medicines] = await Promise.all([
        UserModels.workermailCatchM(shopEmail),
        UserModels.getAllSuppliers(shopEmail),
        UserModels.getMedicine(shopEmail),
      ]);
      res.render('pages/pharmacy/purchase-add', { shopkeeperData, suppliers, medicines, messages: req.query });
    } catch (err) {
      console.error('Purchase add page error:', err);
      res.redirect('/pharmacy/purchases');
    }
  },

  addPurchase: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const { supplier_id, invoice_no, purchase_date, notes, items } = req.body;

      const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
      let subtotal = 0;
      for (const item of parsedItems) {
        subtotal += parseFloat(item.total) || 0;
      }
      const totalAmount = subtotal;
      const paidAmount = totalAmount;
      const dueAmount = 0;

      const result = await UserModels.createPurchase(
        shopEmail, supplier_id || null, invoice_no, purchase_date,
        subtotal, 0, 0, totalAmount, paidAmount, dueAmount, 'paid', notes
      );
      const purchaseId = result.insertId;

      for (const item of parsedItems) {
        await UserModels.createPurchaseItem(
          purchaseId, item.medicine_name, item.batch_no,
          item.expiry_date || null, parseInt(item.quantity),
          parseFloat(item.unit_price), parseFloat(item.mrp) || null,
          parseFloat(item.total)
        );
        await UserModels.addShopMedicineStock(shopEmail, item.medicine_name, parseInt(item.quantity));
      }

      res.redirect('/pharmacy/purchases?added=true');
    } catch (err) {
      console.error('Add purchase error:', err);
      res.redirect('/pharmacy/purchases/add?error=true');
    }
  },

  viewPurchase: async (req, res) => {
    try {
      const { id } = req.params;
      const [purchase, items] = await Promise.all([
        UserModels.getPurchase(id),
        UserModels.getPurchaseItems(id),
      ]);
      if (!purchase) return res.redirect('/pharmacy/purchases');
      const shopkeeperData = await UserModels.workermailCatchM(purchase.shop_email);
      res.render('pages/pharmacy/purchase-view', { purchase, items, shopkeeperData });
    } catch (err) {
      console.error('View purchase error:', err);
      res.redirect('/pharmacy/purchases');
    }
  },

  deletePurchase: async (req, res) => {
    try {
      await UserModels.deletePurchase(req.params.id);
      res.redirect('/pharmacy/purchases?deleted=true');
    } catch (err) {
      console.error('Delete purchase error:', err);
      res.redirect('/pharmacy/purchases?error=true');
    }
  },

  /* ====== SALES ====== */
  getSales: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const [shopkeeperData, sales] = await Promise.all([
        UserModels.workermailCatchM(shopEmail),
        UserModels.getAllSales(shopEmail),
      ]);
      res.render('pages/pharmacy/sales', { shopkeeperData, sales, messages: req.query });
    } catch (err) {
      console.error('Sales error:', err);
      res.redirect('/shopkeeperdesh');
    }
  },

  getSaleAdd: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const [shopkeeperData, medicines] = await Promise.all([
        UserModels.workermailCatchM(shopEmail),
        UserModels.getMedicine(shopEmail),
      ]);
      res.render('pages/pharmacy/sale-add', { shopkeeperData, medicines, messages: req.query });
    } catch (err) {
      console.error('Sale add page error:', err);
      res.redirect('/pharmacy/sales');
    }
  },

  addSale: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const { customer_name, customer_phone, sale_date, sale_type, payment_method, items } = req.body;

      const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
      let subtotal = 0;
      let totalProfit = 0;
      for (const item of parsedItems) {
        subtotal += parseFloat(item.total) || 0;
        totalProfit += parseFloat(item.profit) || 0;
      }
      const totalAmount = subtotal;
      const paidAmount = totalAmount;
      const dueAmount = 0;

      const invoiceNo = 'INV-' + Date.now();

      const result = await UserModels.createSale(
        shopEmail, invoiceNo, sale_date || new Date(),
        customer_name || null, customer_phone || null,
        subtotal, 0, 0, totalAmount, paidAmount, dueAmount,
        totalProfit, payment_method || 'cash', sale_type || 'retail'
      );
      const saleId = result.insertId;

      for (const item of parsedItems) {
        await UserModels.createSaleItem(
          saleId, item.medicine_name, item.batch_no || null,
          parseInt(item.quantity), parseFloat(item.unit_price),
          parseFloat(item.cost_price), parseFloat(item.mrp) || null,
          parseFloat(item.total), parseFloat(item.profit)
        );
        await UserModels.updateShopMedicineStock(shopEmail, item.medicine_name, parseInt(item.quantity));
      }

      res.redirect('/pharmacy/sales?added=true');
    } catch (err) {
      console.error('Add sale error:', err);
      res.redirect('/pharmacy/sales/add?error=true');
    }
  },

  viewSale: async (req, res) => {
    try {
      const { id } = req.params;
      const [sale, items] = await Promise.all([
        UserModels.getSale(id),
        UserModels.getSaleItems(id),
      ]);
      if (!sale) return res.redirect('/pharmacy/sales');
      const shopkeeperData = await UserModels.workermailCatchM(sale.shop_email);
      res.render('pages/pharmacy/sale-view', { sale, items, shopkeeperData });
    } catch (err) {
      console.error('View sale error:', err);
      res.redirect('/pharmacy/sales');
    }
  },

  deleteSale: async (req, res) => {
    try {
      await UserModels.deleteSale(req.params.id);
      res.redirect('/pharmacy/sales?deleted=true');
    } catch (err) {
      console.error('Delete sale error:', err);
      res.redirect('/pharmacy/sales?error=true');
    }
  },

  /* ====== REPORTS ====== */
  getReports: async (req, res) => {
    try {
      const shopEmail = req.user.mail;
      const shopkeeperData = await UserModels.workermailCatchM(shopEmail);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const startDate = req.query.start || `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = req.query.end || now.toISOString().slice(0, 10);

      const [report, sales, purchases, expenses, expenseStats, monthlySales, monthlyExpense] = await Promise.all([
        UserModels.getProfitLossReport(shopEmail, startDate, endDate),
        UserModels.getSalesByDateRange(shopEmail, startDate, endDate),
        UserModels.getPurchasesByDateRange(shopEmail, startDate, endDate),
        UserModels.getExpensesByDateRange(shopEmail, startDate, endDate),
        UserModels.getExpenseStatsByCategory(shopEmail, startDate, endDate),
        UserModels.getMonthlySalesSummary(shopEmail, year, month),
        UserModels.getMonthlyExpenseSummary(shopEmail, year, month),
      ]);

      const netProfit = parseFloat(report.total_sales) - parseFloat(report.total_purchases) - parseFloat(report.total_expenses);

      res.render('pages/pharmacy/reports', {
        shopkeeperData, report, sales, purchases, expenses, expenseStats,
        monthlySales, monthlyExpense, netProfit,
        startDate, endDate, year, month,
      });
    } catch (err) {
      console.error('Reports error:', err);
      res.redirect('/shopkeeperdesh');
    }
  },
};

module.exports = PharmacyController;
