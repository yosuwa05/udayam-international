const express = require('express');
const router = express.Router();
const {
  getSummary,
  getClientsByMonth,
  getPlacesByCategory,
  getPlacesByMonth,
  getRecentActivity,
} = require('../controllers/analyticsController');

router.get('/summary', getSummary);
router.get('/clients-by-month', getClientsByMonth);
router.get('/places-by-category', getPlacesByCategory);
router.get('/places-by-month', getPlacesByMonth);
router.get('/recent-activity', getRecentActivity);

module.exports = router;
