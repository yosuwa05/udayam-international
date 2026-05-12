const Client = require('../models/Client');
const Place = require('../models/Place');

// GET /api/analytics/summary
exports.getSummary = async (req, res, next) => {
  try {
    const [
      totalClients,
      activeClients,
      inactiveClients,
      totalPlaces,
      activePlaces,
      inactivePlaces,
    ] = await Promise.all([
      Client.countDocuments(),
      Client.countDocuments({ status: 'active' }),
      Client.countDocuments({ status: 'inactive' }),
      Place.countDocuments(),
      Place.countDocuments({ status: 'active' }),
      Place.countDocuments({ status: 'inactive' }),
    ]);

    res.json({
      success: true,
      data: {
        clients: { total: totalClients, active: activeClients, inactive: inactiveClients },
        places: { total: totalPlaces, active: activePlaces, inactive: inactivePlaces },
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/clients-by-month
exports.getClientsByMonth = async (req, res, next) => {
  try {
    const result = await Client.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = result.map((item) => ({
      month: months[item._id.month - 1],
      year: item._id.year,
      count: item.count,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/places-by-category
exports.getPlacesByCategory = async (req, res, next) => {
  try {
    const result = await Place.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const data = result.map((item) => ({ category: item._id, count: item.count }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/places-by-month
exports.getPlacesByMonth = async (req, res, next) => {
  try {
    const result = await Place.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = result.map((item) => ({
      month: months[item._id.month - 1],
      year: item._id.year,
      count: item.count,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/analytics/recent-activity
exports.getRecentActivity = async (req, res, next) => {
  try {
    const [recentClients, recentPlaces] = await Promise.all([
      Client.find().sort({ createdAt: -1 }).limit(5).select('name email status createdAt'),
      Place.find().sort({ createdAt: -1 }).limit(5).select('name city category status createdAt'),
    ]);

    res.json({
      success: true,
      data: { recentClients, recentPlaces },
    });
  } catch (err) {
    next(err);
  }
};
