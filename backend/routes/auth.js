import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
/**
 * @swagger
 * /api/auth/login:
 * tags:
 *  - Auth
 *   post:
 *     summary: Login user
 *     description: Returns JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 */

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

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1) check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // 2) hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3) save user
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // 2) compare password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    // 3) create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login success", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

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