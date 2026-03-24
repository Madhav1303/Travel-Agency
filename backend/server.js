import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import destinationRoutes from "./routes/destinations.js";
import hotelRoutes from "./routes/hotels.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LM Travel API",
      version: "1.0.0"
    },
    servers: [
      { url: "http://localhost:3000" }
    ],
       components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// ✅ Connect MongoDB (for users/auth)
await connectDB();

// ✅ __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve images from backend/public
app.use(express.static(path.join(__dirname, "public")));

// ✅ helper: read json from backend/data
function readJSON(fileName) {
  const filePath = path.join(__dirname, "data", fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// Health check
app.get("/", (req, res) => res.send("✅ API running"));

// ✅ AUTH ROUTES (THIS IS THE IMPORTANT LINE)
app.use("/api/auth", authRoutes);

//use this lines of code when MongoDb is used for routing 
/*
app.use("/api", destinationRoutes);
*/
app.use("/api", hotelRoutes);

// JSON APIs
app.get("/api/destinations", (req, res) => {
  try {
    res.json(readJSON("destinations.json"));
  } catch (err) {
    res.status(500).json({ message: "Error reading destinations.json", error: err.message });
  }
});

/*
app.get("/api/hotels", (req, res) => {
  try {
    res.json(readJSON("hotels.json"));
  } catch (err) {
    res.status(500).json({ message: "Error reading hotels.json", error: err.message });
  }
});
*/

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});