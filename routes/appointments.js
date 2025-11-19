const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const requiredRole = require("../middleware/adminMiddleware");
const appointmentController = require("../controllers/appointmentController");

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management
 */

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
 *         description: List of all appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   appointment_date:
 *                     type: string
 *                   status:
 *                     type: string
 *                   patient_id:
 *                     type: integer
 *                   doctor_id:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get a single appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment data
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
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
