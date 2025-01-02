const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const studioRoutes = require("./routes/studio.Routes"); // Adjust the path as necessary
const userRoutes = require("./routes/user.Routes"); // Adjust the path as necessary
const authRoutes = require("./routes/auth.Routes"); // Adjust the path as necessary
const fileRoutes = require("./routes/file.Routes"); // Adjust the path as necessary
const gameRoutes = require("./routes/game.Routes"); // Adjust the path as necessary
const paymentRoutes = require("./routes/payment.Routes"); // Adjust the path as necessary
const assetRoutes = require("./routes/asset.Routes"); // Adjust the path as necessary
const assetpaymentRoutes = require("./routes/assetpayment.Routes"); // Adjust the path as necessary

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/studio", studioRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/asset", assetRoutes);
app.use("/api/assetpayment", assetpaymentRoutes);

module.exports = app;
