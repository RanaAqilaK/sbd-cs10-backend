const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class Transaction {
  static async create({ user_id, item_id, quantity, total, description }) {
    const result = await db.query(
      'INSERT INTO transactions (user_id, item_id, quantity, total, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, item_id, quantity, total, description]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM transactions WHERE id = $1', [id]);
    return result.rows[0];
  }

static async pay(transactionId, userId) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const transRes = await client.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [transactionId, userId]
    );
    const transaction = transRes.rows[0];

    if (!transaction) throw new AppError('Transaction not found', 404);
    if (transaction.status !== 'pending') throw new AppError('Transaction is not pending', 400);

    const userRes = await client.query('SELECT balance FROM users WHERE id = $1 FOR UPDATE', [userId]);
    const user = userRes.rows[0];

    if (user.balance < transaction.total) {
      throw new AppError('Insufficient balance', 400);
    }

    const newBalance = user.balance - transaction.total;
    await client.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId]);
    await client.query("UPDATE transactions SET status = 'paid' WHERE id = $1", [transactionId]);

    await client.query('COMMIT');
    return { transactionId: parseInt(transactionId), newBalance };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

  static async delete(id) {
    const result = await db.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

module.exports = Transaction;