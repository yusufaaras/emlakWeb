import express from "express";
import { createProperty, listProperties } from "../controllers/propertyController";

const router = express.Router();

router.post("/", createProperty);
router.get("/", listProperties);

export default router;