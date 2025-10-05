module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "doctor", "reception"), allowNull: false },
  }, {
    freezeTableName: true,
    tableName: "users",
    timestamps: false,
  });
};
