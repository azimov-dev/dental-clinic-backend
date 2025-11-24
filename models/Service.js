// backend/models/Service.js
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    "Service",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // NEW: link to category
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // NEW: raw material cost (xom ashyo narxi)
      material_cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      // NEW: status (Faol / Nofaol)
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
      tableName: "services",
      timestamps: false,
    },
  );

  return Service;
};
