module.exports = (sequelize, DataTypes) => {
    return sequelize.define('mem', {
      userid: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
      pswd: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      credit: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      coin: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      key_coin: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
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