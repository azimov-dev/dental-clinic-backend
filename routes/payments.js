// routes/payments.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const requiredRole = require("../middleware/adminMiddleware");
const paymentController = require("../controllers/paymentController");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payments and payment history
 */

/**
 * @swagger
 * /api/payments/my:
 *   get:
 *     summary: Get payment history of logged-in doctor
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (inclusive)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (inclusive)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Payment type (cash, card, etc.)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by patient name or phone
 *     responses:
 *       200:
 *         description: List of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a payment for a treatment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - treatment_id
 *               - amount
 *               - payment_type
 *             properties:
 *               treatment_id:
 *                 type: integer
 *               amount:
 *                 type: integer
 *               payment_type:
 *                 type: string
 *                 example: cash
 *               paid_at:
 *                 type: string
 *                 format: date-time
 *                 description: If missing, current time will be used
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created and treatment updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Treatment not found
 *       403:
 *         description: Forbidden
 */

// doctor payment history
router.get(
  "/my",
  auth,
  requiredRole(["doctor", "admin"]),
  paymentController.getMyPayments,
);

// add new payment
router.post(
  "/",
  auth,
  requiredRole(["doctor", "admin"]),
  paymentController.createPayment,
);

module.exports = router;
