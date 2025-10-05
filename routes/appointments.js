const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const requiredRole = require('../middleware/adminMiddleware');
const appointmentController = require('../controllers/appointmentController');

router.post('/', auth, requiredRole(['receptionist','admin']), appointmentController.createAppointment);
router.get('/', auth, requiredRole(['receptionist','doctor','admin']), appointmentController.getAppointments);
router.get('/:id', auth, requiredRole(['receptionist','doctor','admin']), appointmentController.getAppointmentById);
router.put('/:id/status', auth, requiredRole(['doctor','admin']), appointmentController.updateAppointmentStatus);

module.exports = router;
