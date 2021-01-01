module.exports = (sequelize, DataTypes) => {
    return sequelize.define('item', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userid: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      item_name: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      is_main: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('now()'),
      },
    }, {
      timestamps: false,
    });
  };