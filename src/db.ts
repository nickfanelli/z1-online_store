import { Sequelize } from "sequelize";

// Initialize Sequelize with SQLite as the database
const sequelize = new Sequelize({
  dialect: "sqlite",         // use SQLite
  storage: "./database.sqlite", // file-based SQLite database
  logging: false,            // disable logging to keep the console clean
});

// Export the Sequelize instance for use in other parts of the app
export default sequelize;
