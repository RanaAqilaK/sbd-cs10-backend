const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');
const { 
reportTopUsersValidation, 
reportMonthlySalesValidation, 
validate 
} = require('../utils/validators');

router.get('/top-users', reportTopUsersValidation, validate, ReportController.getTopUsers);
router.get('/items-sold', ReportController.getItemsSold);
router.get('/monthly-sales', reportMonthlySalesValidation, validate, ReportController.getMonthlySales);

module.exports = router;