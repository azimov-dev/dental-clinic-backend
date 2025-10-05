module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define("Appointment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointment_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
  }, {
    tableName: "appointments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });

  Appointment.associate = models => {
    Appointment.belongsTo(models.Patient, { foreignKey: "patient_id" });
    Appointment.belongsTo(models.User, { foreignKey: "doctor_id" });
    Appointment.belongsTo(models.Service, { foreignKey: "service_id" });
  };

  return Appointment;
};
