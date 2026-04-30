const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class ReportController {
  static async getTopUsers(req, res, next) {
    try {
      const limit = req.query.limit || 10;
      
      const query = `
        SELECT 
          u.id, u.name, u.username, u.email, u.phone, u.balance,
          SUM(t.total) AS total_spent,
          RANK() OVER (ORDER BY SUM(t.total) DESC) AS rank
        FROM users u
        JOIN transactions t ON u.id = t.user_id
        WHERE t.status = 'paid'
        GROUP BY u.id
        LIMIT $1
      `;
      const result = await db.query(query, [limit]);
      
      res.status(200).json({
        success: true,
        message: 'Top users retrieved successfully',
        payload: result.rows
      });
    } catch (error) {
      next(error);
    }
  }

  static async getItemsSold(req, res, next) {
    try {
      const query = `
        SELECT 
          i.id, i.name, i.price, i.stock,
          SUM(t.quantity) AS total_quantity_sold,
          SUM(t.total) AS total_revenue
        FROM items i
        JOIN transactions t ON i.id = t.item_id
        WHERE t.status = 'paid'
        GROUP BY i.id
      `;
      const result = await db.query(query);
      
      res.status(200).json({
        success: true,
        message: 'Items sold retrieved successfully',
        payload: result.rows
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMonthlySales(req, res, next) {
    try {
      const year = req.query.year || 2026;
      
      const query = `
        SELECT 
          date_trunc('month', created_at) AS month,
          COUNT(id) AS transaction_count,
          SUM(total) AS total_revenue
        FROM transactions
        WHERE status = 'paid' AND EXTRACT(YEAR FROM created_at) = $1
        GROUP BY month
        ORDER BY month ASC
      `;
      const result = await db.query(query, [year]);
      
      res.status(200).json({
        success: true,
        message: 'Monthly sales retrieved successfully',
        payload: result.rows
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportController;