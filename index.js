require("dotenv").config();
const express = require("express");
const app = express();
const sequelize = require("./db");
const models = require("./models"); // loads models and associations
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173", // dev Vite
      "https://dental-clinic-frontend.onrender.com", // prod frontend (when you have one)
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const setupSwagger = require("./swagger");
setupSwagger(app);

const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/services");
const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");

const errorHandler = require("./middleware/errorHandler");

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/test", async (req, res) => {
  res.send("Backend is working!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server ${PORT}-portda ishga tushdi`),
    );
  })
  .catch((err) => {
    console.error("Failed to sync database", err);
    process.exit(1);
  });
