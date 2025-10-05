module.exports = (sequelize, DataTypes) => {
  const AppointmentItem = sequelize.define("AppointmentItem", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price_at_time: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    }
  }, {
    tableName: "appointment_items",
    timestamps: true,
    underscored: true,
  });

  return AppointmentItem;
};
