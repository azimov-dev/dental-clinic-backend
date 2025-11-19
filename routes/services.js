const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const requiredRole = require("../middleware/adminMiddleware");
const serviceController = require("../controllers/serviceController");

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Dental services
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a single service by ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service data
 *       404:
 *         description: Service not found
 *       401:
 *         description: Unauthorized
 */

router.get(
  "/",
  auth,
  requiredRole(["receptionist", "doctor", "admin"]),
  serviceController.getAllServices,
);
router.post(
  "/",
  auth,
  requiredRole(["admin"]),
  serviceController.createService,
);
router.put(
  "/:id",
  auth,
  requiredRole(["admin"]),
  serviceController.updateService,
);
router.delete(
  "/:id",
  auth,
  requiredRole(["admin"]),
  serviceController.deleteService,
);

module.exports = router;
