const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const requiredRole = require("../middleware/adminMiddleware");
const serviceController = require("../controllers/serviceController");

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all dental services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of services
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a dental service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: integer }
 *     responses:
 *       201:
 *         description: Service created
 */

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
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
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *     responses:
 *       200:
 *         description: Deleted
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
