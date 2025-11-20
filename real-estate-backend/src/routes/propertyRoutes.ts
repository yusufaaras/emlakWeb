import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Upload klasörünü oluştur ve disk storage ayarla
const uploadPath = path.join(__dirname, "../../uploads/properties");
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadPath),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-")),
});

const upload = multer({ storage });

// GET /api/properties  -> ilan listesi
router.get("/", async (req, res, next) => {
  try {
    const ctrl = await import("../controllers/propertyController");
    // ctrl.listProperties should be a function exported from controller
    if (typeof ctrl.listProperties !== "function") {
      return res.status(500).json({ error: "listProperties handler undefined" });
    }
    return ctrl.listProperties(req, res, next);
  } catch (err) {
    next(err);
  }
});

// POST /api/properties -> ilan oluştur (mainPhoto + detailPhotos)
router.post(
  "/",
  upload.fields([
    { name: "mainPhoto", maxCount: 1 },
    { name: "detailPhotos", maxCount: 10 },
  ]),
  async (req, res, next) => {
    try {
      const ctrl = await import("../controllers/propertyController");
      if (typeof ctrl.createProperty !== "function") {
        return res.status(500).json({ error: "createProperty handler undefined" });
      }
      return ctrl.createProperty(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

export default router;