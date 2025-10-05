module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Service", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    freezeTableName: true,
    tableName: "services",
    timestamps: false,
  });
};
