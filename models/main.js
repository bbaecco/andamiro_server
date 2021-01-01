module.exports = (sequelize, DataTypes) => {
    return sequelize.define('main', {
      userid: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
      planet: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      item1: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      item1_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      item1_location: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      item2: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      item2_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      item2_location: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      item3: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      item3_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      item3_location: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      item4: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      item4_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      item4_location: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      item5: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      item5_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      item5_location: {
        type: DataTypes.STRING(40),
        allowNull: true,
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