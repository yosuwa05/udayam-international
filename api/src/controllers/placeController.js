const Place = require('../models/Place');

// GET /api/places
exports.getPlaces = async (req, res, next) => {
  try {
    const { status, search, city, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (city) query.city = new RegExp(city, 'i');
    if (category && category !== 'all') query.category = category;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { address: new RegExp(search, 'i') },
        { city: new RegExp(search, 'i') },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Place.countDocuments(query);
    const places = await Place.find(query)
      .populate('client', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: places,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/places/:id
exports.getPlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id).populate('client', 'name email phone');
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

// POST /api/places
exports.createPlace = async (req, res, next) => {
  try {
    const place = new Place(req.body);
    await place.save();
    res.status(201).json({ success: true, message: 'Place created successfully', data: place });
  } catch (err) {
    next(err);
  }
};

// PUT /api/places/:id
exports.updatePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, message: 'Place updated successfully', data: place });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/places/:id
exports.deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, message: 'Place deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/places/:id/toggle-status
exports.toggleStatus = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    place.status = place.status === 'active' ? 'inactive' : 'active';
    await place.save();
    res.json({
      success: true,
      message: `Place marked as ${place.status}`,
      data: place,
    });
  } catch (err) {
    next(err);
  }
};
