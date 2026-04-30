const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');
const { AppError } = require('../middleware/errorHandler');

router.post('/login', async (req, res, next) => {
try {
    const { email, password } = req.body;

    const result = await UserService.login(email, password);
    const user = result.user;

    // Payload JWT
    const payload = {
    userId: user.id,
    email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
    success: true,
    message: 'Login successful',
    payload: {
        token: token,
        user: user
    }
    });
} catch (error) {
    next(error);
}
});

router.post('/register', async (req, res, next) => {
try {
    const { name, username, email, phone, password } = req.body;

    // Validate required fields
    if (!email || !password || !username) {
      throw new AppError('Email, username, and password are required', 400);
    }

    const user = await UserService.register({
      name: name || username,
      username,
      email,
      phone: phone || null,
      password
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      payload: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
} catch (error) {
    next(error);
}
});

module.exports = router;