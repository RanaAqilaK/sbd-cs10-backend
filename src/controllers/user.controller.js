const UserService = require('../services/user.service');
const { AppError } = require('../middleware/errorHandler');
const redis = require('../database/redis');

class UserController {
  static async register(req, res, next) {
    try {
      const { name, username, email, phone, password } = req.body;
      const user = await UserService.register({ name, username, email, phone, password });
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        payload: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await UserService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        payload: result.user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { id, name, username, email, phone, password, balance } = req.body;
      const updatedUser = await UserService.updateProfile(id, { name, username, email, phone, password, balance });

      // Delete cache setiap update
      const cacheKeys = [email, updatedUser.email]
        .filter(Boolean)
        .map((value) => `user:${value}`);
      if (cacheKeys.length > 0) {
        await redis.del(...cacheKeys);
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        payload: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionHistory(req, res, next) {
    try {
      // For simplicity, use user_id from query param (insecure)
      const userId = req.query.user_id || 1;
      const history = await UserService.getTransactionHistory(userId);
      res.status(200).json({
        success: true,
        message: 'Transaction history retrieved',
        payload: history,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTotalSpent(req, res, next) {
    try {
      const userId = req.query.user_id || 1;
      const totalSpent = await UserService.getTotalSpent(userId);
      res.status(200).json({
        success: true,
        message: 'Total spent retrieved',
        payload: { total_spent: totalSpent },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserByEmail(req, res, next) {
    try {
      const email = req.params.email;
      const cacheKey = `user:${email}`;


      // Cek cache di redis
      const cachedUser = await redis.get(cacheKey);
      if (cachedUser) {
        return res.status(200).json({
          success: true,
          message: 'User retrieved successfully from cache',
          payload: JSON.parse(cachedUser),
        });
      }

      // Cache miss, ambil dari database
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Save jadi cache
      const { password, ...safeUser } = user;
      await redis.set(cacheKey, JSON.stringify(safeUser), 'EX', 60);

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully from database',
        payload: safeUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;