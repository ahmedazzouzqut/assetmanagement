
const express = require('express');
// Importing the asset controller functions
const { getAssets, addAsset, updateAsset, deleteAsset } = require('../controllers/assetController');
// Importing the authentication middleware
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
//router.get('/ping', (req, res) => res.json({ ok: true }));

router.route('/').get(protect, getAssets).post(protect, addAsset);
router.route('/:id').put(protect, updateAsset).delete(protect, deleteAsset);

module.exports = router;
