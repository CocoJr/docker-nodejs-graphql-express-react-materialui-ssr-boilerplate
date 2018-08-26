'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable(
          'user',
          {
              id: {
                  type: Sequelize.INTEGER,
                  primaryKey: true,
                  autoIncrement: true,
              },
              username: {
                  type: Sequelize.STRING,
                  allowNull: false,
                  unique: true,
              },
              email: {
                  type:  Sequelize.STRING,
                  allowNull: false,
                  unique: true,
              },
              password: {
                  type: Sequelize.STRING,
                  allowNull: false,
              },
              isActive: {
                  type: Sequelize.BOOLEAN,
                  allowNull: false,
                  defaultValue: true,
              },
              roles: {
                  type: Sequelize.JSON,
                  allowNull: false,
                  defaultValue: {0: 'ROLE_USER'},
              },
              imgProfil: {
                  type: Sequelize.STRING,
                  allowNull: true,
              },
              createdAt: {
                  type: Sequelize.DATE,
                  allowNull: false,
                  defaultValue: Sequelize.fn('now'),
              },
              updatedAt: {
                  type: Sequelize.DATE,
                  allowNull: false,
                  defaultValue: Sequelize.fn('now'),
              },
          }
      );
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('user', {});
  }
};
