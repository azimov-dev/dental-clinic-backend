const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const requiredRole = require("../middleware/adminMiddleware");
const patientController = require("../controllers/patientController");

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management
 */

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   birth_date:
 *                     type: string
 *                   address:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get a single patient by ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient data
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 */

router.post(
  "/",
  auth,
  requiredRole(["receptionist", "admin"]),
  patientController.createPatient,
);
router.get(
  "/",
  auth,
  requiredRole(["receptionist", "doctor", "admin"]),
  patientController.getPatients,
);
router.get(
  "/:id",
  auth,
  requiredRole(["receptionist", "doctor", "admin"]),
  patientController.getPatientById,
);
router.put(
  "/:id",
  auth,
  requiredRole(["receptionist", "admin"]),
  patientController.updatePatient,
);
router.delete(
  "/:id",
  auth,
  requiredRole(["admin"]),
  patientController.deletePatient,
);

module.exports = router;
