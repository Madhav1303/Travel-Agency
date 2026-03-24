import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/hotels.json");
const router = express.Router();

function readHotels() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

/** 
 * @swagger
 * /api/hotels:
 *   get:
 *     summary: Get all hotels
 *     description: Fetch all hotels
 *     tags:
 *       - Hotels
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   location:
 *                     type: string
 *                   pricePerNight:
 *                     type: number
 *                   rating:
 *                     type: number
 *                   image:
 *                     type: string
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Add a new hotel
 *     description: Insert a new hotel into database
 *     tags:
 *       - Hotels
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - pricePerNight
 *               - rating
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Seaside Resort
 *               location:
 *                 type: string
 *                 example: Goa, India
 *               pricePerNight:
 *                 type: number
 *                 example: 3200
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               image:
 *                 type: string
 *                 example: https://example.com/hotel.jpg
 *     responses:
 *       201:
 *         description: Hotel added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

 /**
 * @swagger 
 * /api/hotels/{id}:
 *   delete:
 *     summary: Delete a hotel
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hotel not found
 */


// ✅ DELETE or UPDATE HOTEL

// 🔐 Middleware to protect routes
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach user info

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default router;