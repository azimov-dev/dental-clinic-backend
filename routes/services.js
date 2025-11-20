const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const requiredRole = require("../middleware/adminMiddleware");
const serviceController = require("../controllers/serviceController");

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Dental services management
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all dental services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all services
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service info
 *       404:
 *         description: Service not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - doctorShare
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               doctorShare:
 *                 type: number
 *                 description: Percentage share for doctor
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Service ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               doctorShare:
 *                 type: number
 *     responses:
 *       200:
 *         description: Service updated
 *       404:
 *         description: Service not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted
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
