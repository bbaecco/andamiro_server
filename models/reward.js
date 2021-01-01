module.exports = (sequelize, DataTypes) => {
    return sequelize.define('reward', {
      userid: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
      c1: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      c2: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      c3: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      c4: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      c5: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      sea: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      oasis: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      forest: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      rose: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      tako: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      apple: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      waffle: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      donut: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      ice: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: false,
      },
      cheese: {
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