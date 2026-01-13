const express = require("express");
const app = express();
const logger = require("./utils/logger");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // ✅ FIXED
const connectDB = require("./config/db.config");
const { generalLimiter, securityHeaders } = require("./middleware/security");

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "*", // 🔒 restrict later to Vercel domain
  credentials: true
}));
app.use(securityHeaders);
app.use(generalLimiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ================= STATIC FILES =================
const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

// ================= DATABASE =================
connectDB()
  .then(() => {
    logger.info("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    logger.error("❌ MongoDB connection failed", err);
  });

// ================= ROUTES =================
app.use("/api", require("./routes/index"));

// Health check (Render)
app.get("/", (req, res) => {
  res.status(200).send("Backend is running 🚀");
});

app.get("/get", async (req, res) => {
  res.send({ message: "API is working!" });
});

// ================= SERVER =================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
