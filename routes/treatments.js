// routes/treatments.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const requiredRole = require("../middleware/adminMiddleware");
const treatmentController = require("../controllers/treatmentController");

/**
 * @swagger
 * tags:
 *   name: Treatments
 *   description: Dental treatments (doctor side)
 */

/**
 * @swagger
 * /api/treatments/my:
 *   get:
 *     summary: Get treatments of logged-in doctor
 *     tags: [Treatments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (inclusive), e.g. 2025-11-01
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (inclusive), e.g. 2025-11-30
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, doctor_finished, paid, cancelled]
 *         description: Filter by treatment status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by patient name or phone
 *     responses:
 *       200:
 *         description: List of treatments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /api/treatments/my-debts:
 *   get:
 *     summary: Get treatments with remaining debt (logged-in doctor)
 *     tags: [Treatments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of treatments that still have debt
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /api/treatments:
 *   post:
 *     summary: Create a new treatment
 *     tags: [Treatments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - treatment_date
 *               - total_amount
 *             properties:
 *               patient_id:
 *                 type: integer
 *               appointment_id:
 *                 type: integer
 *                 nullable: true
 *               treatment_date:
 *                 type: string
 *                 format: date-time
 *               total_amount:
 *                 type: integer
 *               discount_amount:
 *                 type: integer
 *                 default: 0
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Treatment created
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/treatments/{id}:
 *   patch:
 *     summary: Update a treatment (only own for doctor)
 *     tags: [Treatments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               treatment_date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [new, doctor_finished, paid, cancelled]
 *               total_amount:
 *                 type: integer
 *               discount_amount:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Treatment updated
 *       404:
 *         description: Treatment not found
 *       403:
 *         description: Forbidden
 */

// doctor treatments list
router.get(
  "/my",
  auth,
  requiredRole(["doctor", "admin"]),
  treatmentController.getMyTreatments,
);

// debt treatments
router.get(
  "/my-debts",
  auth,
  requiredRole(["doctor", "admin"]),
  treatmentController.getMyDebtTreatments,
);

// create treatment
router.post(
  "/",
  auth,
  requiredRole(["doctor", "admin"]),
  treatmentController.createTreatment,
);

// update treatment
router.patch(
  "/:id",
  auth,
  requiredRole(["doctor", "admin"]),
  treatmentController.updateTreatment,
);

module.exports = router;
