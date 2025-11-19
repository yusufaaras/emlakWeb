'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('properties', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      listingCode: { type: Sequelize.STRING, unique: true, allowNull: true },
      branchId: { type: Sequelize.INTEGER, allowNull: true },
      category: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: true },
      province: { type: Sequelize.STRING, allowNull: true },
      district: { type: Sequelize.STRING, allowNull: true },
      neighborhood: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      location: { type: Sequelize.JSON, allowNull: true },
      saleType: { type: Sequelize.ENUM('satilik','kiralik'), allowNull: false, defaultValue: 'satilik' },
      propertyType: { type: Sequelize.ENUM('konut','arsa','ticari','devren','tarla','bahce','hobi_bahcesi'), allowNull: false, defaultValue: 'konut' },
      subType: { type: Sequelize.STRING, allowNull: true },
      price: { type: Sequelize.DECIMAL(18,2), allowNull: true },
      rentPrice: { type: Sequelize.DECIMAL(18,2), allowNull: true },
      createdBy: { type: Sequelize.INTEGER, allowNull: true },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      attributes: { type: Sequelize.JSON, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('properties');
  }
};