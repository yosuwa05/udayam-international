const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['restaurant', 'hotel', 'park', 'shop', 'hospital', 'school', 'office', 'other'],
      default: 'other',
    },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    website: { type: String, trim: true, default: '' },
    images: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: null },
  },
  { timestamps: true }
);

placeSchema.index({ name: 'text', description: 'text', city: 'text', address: 'text' });

module.exports = mongoose.model('Place', placeSchema);
