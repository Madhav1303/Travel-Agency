import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/destinations.json");
const router = express.Router();

function readDestinations() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Get all destinations
 *     description: Fetch all travel destinations
 *     tags:
 *       - Destinations
 *     responses:
 *       200:
 *         description: List of destinations
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
 *                   price:
 *                     type: number
 *                   image:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Add a new destination
 *     description: Insert a new destination into database
 *     tags:
 *       - Destinations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - price
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: Goa Beach
 *               location:
 *                 type: string
 *                 example: Goa, India
 *               price:
 *                 type: number
 *                 example: 15000
 *               image:
 *                 type: string
 *                 example: https://example.com/goa.jpg
 *               description:
 *                 type: string
 *                 example: Beautiful beaches and nightlife
 *     responses:
 *       201:
 *         description: Destination added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

// ✅ GET all destinations
router.get("/destinations", (req, res) => {
  try {
    const destinations = readJSON();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ POST new destination
router.post("/destinations", (req, res) => {
  try {
    const { name, location, price, image, description } = req.body;

    // validation
    if (!name || !location || !price || !image) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const data = readJSON();

    const newDestination = {
      id: Date.now(),
      name,
      location,
      price,
      image,
      description
    };

    data.push(newDestination);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(201).json({
      message: "Destination added successfully",
      destination: newDestination
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});
export default router;