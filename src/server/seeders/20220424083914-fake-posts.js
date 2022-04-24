"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .query("SELECT id from Users;")
      .then((users) => {
        console.log(users);
        const usersRows = users[0];

        return queryInterface.bulkInsert("Posts", [
          {
            text: "Lorem Ipsum 1",
            userId: usersRows[0].id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            text: "Lorem Ipsum 2",
            userId: usersRows[1].id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Posts", null, {});
  },
};
