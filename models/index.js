// backend/models/index.js
const Sequelize = require("sequelize");
const sequelize = require("../db");

const db = {};

// import models
db.User = require("./User")(sequelize, Sequelize.DataTypes);
db.Patient = require("./Patient")(sequelize, Sequelize.DataTypes);
db.Service = require("./Service")(sequelize, Sequelize.DataTypes);
db.ServiceCategory = require("./ServiceCategory")(
  sequelize,
  Sequelize.DataTypes,
);
db.Appointment = require("./Appointment")(sequelize, Sequelize.DataTypes);
db.AppointmentItem = require("./AppointmentItem")(
  sequelize,
  Sequelize.DataTypes,
);
db.Treatment = require("./Treatment")(sequelize, Sequelize.DataTypes);
db.Payment = require("./Payment")(sequelize, Sequelize.DataTypes);

const {
  User,
  Patient,
  Service,
  Appointment,
  AppointmentItem,
  Treatment,
  Payment,
} = db;

// ============= Associations ============= //

// Appointments <-> Patient
Appointment.belongsTo(Patient, {
  foreignKey: "patient_id",
  as: "patient",
});
Patient.hasMany(Appointment, {
  foreignKey: "patient_id",
  as: "appointments",
});

// Appointments <-> Doctor (User)
Appointment.belongsTo(User, {
  foreignKey: "doctor_id",
  as: "doctor",
});
User.hasMany(Appointment, {
  foreignKey: "doctor_id",
  as: "appointments",
});

// AppointmentItems
Appointment.hasMany(AppointmentItem, {
  foreignKey: "appointment_id",
  as: "items",
  onDelete: "CASCADE",
});
AppointmentItem.belongsTo(Appointment, {
  foreignKey: "appointment_id",
  as: "appointment",
});

Service.hasMany(AppointmentItem, {
  foreignKey: "service_id",
  as: "appointment_items",
});
AppointmentItem.belongsTo(Service, {
  foreignKey: "service_id",
  as: "service",
});

// Service categories
Service.belongsTo(ServiceCategory, {
  foreignKey: "category_id",
  as: "category",
});
ServiceCategory.hasMany(Service, {
  foreignKey: "category_id",
  as: "services",
});

// ---------- Treatments ---------- //
Treatment.belongsTo(Patient, {
  foreignKey: "patient_id",
  as: "patient",
});
Patient.hasMany(Treatment, {
  foreignKey: "patient_id",
  as: "treatments",
});

Treatment.belongsTo(User, {
  foreignKey: "doctor_id",
  as: "doctor",
});
User.hasMany(Treatment, {
  foreignKey: "doctor_id",
  as: "treatments",
});

Treatment.belongsTo(Appointment, {
  foreignKey: "appointment_id",
  as: "appointment",
});
Appointment.hasOne(Treatment, {
  foreignKey: "appointment_id",
  as: "treatment",
});

// ---------- Payments ---------- //
Payment.belongsTo(Patient, {
  foreignKey: "patient_id",
  as: "patient",
});
Patient.hasMany(Payment, {
  foreignKey: "patient_id",
  as: "payments",
});

Payment.belongsTo(User, {
  foreignKey: "doctor_id",
  as: "doctor",
});
User.hasMany(Payment, {
  foreignKey: "doctor_id",
  as: "payments",
});

Payment.belongsTo(Treatment, {
  foreignKey: "treatment_id",
  as: "treatment",
});
Treatment.hasMany(Payment, {
  foreignKey: "treatment_id",
  as: "payments",
});

// export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
