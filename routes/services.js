const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const requiredRole = require('../middleware/adminMiddleware');
const serviceController = require('../controllers/serviceController');

router.get('/', auth, requiredRole(['receptionist','doctor','admin']), serviceController.getAllServices);
router.post('/', auth, requiredRole(['admin']), serviceController.createService);
router.put('/:id', auth, requiredRole(['admin']), serviceController.updateService);
router.delete('/:id', auth, requiredRole(['admin']), serviceController.deleteService);

module.exports = router;
