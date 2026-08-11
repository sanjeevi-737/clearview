import { Router } from "express";
import { analysisController } from "../controllers/analysis.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { analyzeLimiter } from "../middleware/rateLimit.js";
import {
  analyzeSchema,
  objectIdSchema,
  paginationSchema,
} from "../validations/analysis.schema.js";

const router = Router();

router.post("/analyze", authenticate, analyzeLimiter, validate(analyzeSchema), analysisController.analyze);
router.get("/history", authenticate, validate(paginationSchema, "query"), analysisController.history);
router.get("/analysis/demo", analysisController.demo);
router.get("/analysis/:id/pdf", authenticate, validate(objectIdSchema, "params"), analysisController.downloadPdf);
router.get("/analysis/:id", authenticate, validate(objectIdSchema, "params"), analysisController.getById);
router.delete("/analysis/:id", authenticate, validate(objectIdSchema, "params"), analysisController.remove);

export default router;
