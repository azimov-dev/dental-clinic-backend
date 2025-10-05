module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Patient", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    birth_date: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
  }, {
    freezeTableName: true,
    tableName: "patients",
    timestamps: false,
  });
};
