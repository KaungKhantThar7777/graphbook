import Sequelize from "sequelize";

if (process.env.NODE_ENV === "development") {
  require("babel-plugin-require-context-hook/register")();
}

export default (sequelize) => {
  let db = {};

  const context = require.context(
    ".",
    true,
    /^\.\/(?!index\.js).*\.js$/,
    "sync"
  );

  context
    .keys()
    .map(context)
    .forEach((module) => {
      const model = module(sequelize, Sequelize);
      db[model.name] = model;
    });

  Object.keys(db).forEach((moduleName) => {
    if (db[moduleName].associate) {
      db[moduleName].associate(db);
    }
  });

  return db;
};
