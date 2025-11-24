// backend/models/Treatment.js
module.exports = (sequelize, DataTypes) => {
  const Treatment = sequelize.define(
    "Treatment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // treatment can be without calendar appointment
      },

      treatment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        // new, doctor finished, fully paid, cancelled, etc.
        type: DataTypes.ENUM("new", "doctor_finished", "paid", "cancelled"),
        defaultValue: "new",
      },

      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      discount_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      paid_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "treatments",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    },
  );

  return Treatment;
};
