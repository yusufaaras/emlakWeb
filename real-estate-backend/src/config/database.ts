import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Property } from "../models/Property";
import { PropertyImage } from "../models/PropertyImage"; // <-- ekledik

dotenv.config();

export const sequelize = new Sequelize({
  database: process.env.DB_NAME || "real_estate_db",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  dialect: "mysql",
  models: [User, Property, PropertyImage], 
  logging: false,
});