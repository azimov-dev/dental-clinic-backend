const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const requiredRole = require("../middleware/adminMiddleware");
const appointmentController = require("../controllers/appointmentController");

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 */

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Create an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id: { type: integer }
 *               doctor_id: { type: integer }
 *               service_id: { type: integer }
 *               appointment_date: { type: string }
 *     responses:
 *       201:
 *         description: Appointment created
 */

/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Update appointment status or details
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Updated
 */

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200:
 *         description: Appointment deleted
 */

router.post(
  "/",
  auth,
  requiredRole(["receptionist", "admin"]),
  appointmentController.createAppointment,
);
router.get(
  "/",
  auth,
  requiredRole(["receptionist", "doctor", "admin"]),
  appointmentController.getAppointments,
);
router.get(
  "/:id",
  auth,
  requiredRole(["receptionist", "doctor", "admin"]),
  appointmentController.getAppointmentById,
);
router.put(
  "/:id/status",
  auth,
  requiredRole(["doctor", "admin"]),
  appointmentController.updateAppointmentStatus,
);

module.exports = router;
