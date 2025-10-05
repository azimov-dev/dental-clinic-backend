const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const requiredRole = require('../middleware/adminMiddleware');
const patientController = require('../controllers/patientController');

router.post('/', auth, requiredRole(['receptionist','admin']), patientController.createPatient);
router.get('/', auth, requiredRole(['receptionist','doctor','admin']), patientController.getPatients);
router.get('/:id', auth, requiredRole(['receptionist','doctor','admin']), patientController.getPatientById);
router.put('/:id', auth, requiredRole(['receptionist','admin']), patientController.updatePatient);
router.delete('/:id', auth, requiredRole(['admin']), patientController.deletePatient);

module.exports = router;
