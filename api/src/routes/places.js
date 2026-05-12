const express = require('express');
const router = express.Router();
const {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
  toggleStatus,
} = require('../controllers/placeController');

router.get('/', getPlaces);
router.get('/:id', getPlace);
router.post('/', createPlace);
router.put('/:id', updatePlace);
router.delete('/:id', deletePlace);
router.patch('/:id/toggle-status', toggleStatus);

module.exports = router;
