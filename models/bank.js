module.exports = (sequelize, DataTypes) => {
    return sequelize.define('bank', {
      userid: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
      juckgeum_put: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      juckgeum: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      juckgeum_ok: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      juckgeum_day: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      juckgeum_created:{
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      yegeum: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      yegeum_ok: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      yegeum_day: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      yegeum_created:{
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      card: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      card_ok: {
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