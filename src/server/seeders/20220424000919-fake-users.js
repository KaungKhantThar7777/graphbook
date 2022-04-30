"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          avatar: "/uploads/avatar1.png",
          username: "TestUser",
          createdAt: new Date(),
          updatedAt: new Date(),
          password:
            "$2a$10$bE3ovf9/Tiy/d68bwNUQ0.zCjwtNFq9ukg9h4rhKiHCb6x5ncKife",
          email: "test1@example.com",
        },
        {
          avatar: "/uploads/avatar2.png",
          username: "TestUser2",
          createdAt: new Date(),
          updatedAt: new Date(),
          password:
            "$2a$10$bE3ovf9/Tiy/d68bwNUQ0.zCjwtNFq9ukg9h4rhKiHCb6x5ncKife",
          email: "test2@example.com",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
