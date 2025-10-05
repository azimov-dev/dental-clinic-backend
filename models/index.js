const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../db');

const db = {};

// import models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Patient = require('./Patient')(sequelize, Sequelize.DataTypes);
const Service = require('./Service')(sequelize, Sequelize.DataTypes);
const Appointment = require('./Appointment')(sequelize, Sequelize.DataTypes);
const AppointmentItem = require('./AppointmentItem')(sequelize, Sequelize.DataTypes);

// put into db object
db.User = User;
db.Patient = Patient;
db.Service = Service;
db.Appointment = Appointment;
db.AppointmentItem = AppointmentItem;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Associations
// Appointment belongs to Patient and Doctor (User with role doctor)
Appointment.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Patient.hasMany(Appointment, { foreignKey: 'patient_id', as: 'appointments' });

Appointment.belongsTo(User, { foreignKey: 'doctor_id', as: 'doctor' });
User.hasMany(Appointment, { foreignKey: 'doctor_id', as: 'appointments' });

// AppointmentItems
Appointment.hasMany(AppointmentItem, { foreignKey: 'appointment_id', as: 'items', onDelete: 'CASCADE' });
AppointmentItem.belongsTo(Appointment, { foreignKey: 'appointment_id', as: 'appointment' });

Service.hasMany(AppointmentItem, { foreignKey: 'service_id', as: 'appointment_items' });
AppointmentItem.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

module.exports = db;
