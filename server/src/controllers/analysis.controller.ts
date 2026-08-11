import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { analysisService } from "../services/analysis.service.js";
import { demoService } from "../services/demo.service.js";
import { generatePdfReport } from "../services/pdf.service.js";
import { ApiError } from "../utils/ApiError.js";
import type { AnalyzeInput, PaginationInput, ObjectIdInput } from "../validations/analysis.schema.js";

export const analysisController = {
  /**
   * @swagger
   * /analyze:
   *   post:
   *     summary: Analyze a website (scrape + readability + clutter + structure + AI summary)
   *     tags: [Analysis]
   *     security: [{ bearerAuth: [] }]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AnalyzeRequest'
   *     responses:
   *       201: { $ref: '#/components/responses/AnalysisSuccess' }
   *       422: { $ref: '#/components/responses/Error' }
   */
  analyze: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { url } = req.body as AnalyzeInput;
    const skipCache = req.query.cache === "0";
    const { analysis, fromCache } = await analysisService.analyze(userId, url, {
      skipCache,
    });
    res.status(201).json({
      success: true,
      data: analysis,
      meta: { cached: fromCache },
    });
  }),

  /**
   * @swagger
   * /analysis/demo:
   *   get:
   *     summary: Fetch a seeded demo report (public, no auth required)
   *     tags: [Analysis]
   *     responses:
   *       200:
   *         description: Latest demo report
   *       404:
   *         description: No demo report seeded yet
   */
  demo: asyncHandler(async (_req: Request, res: Response) => {
    const analysis = await demoService.demoReport();
    if (!analysis) {
      throw new ApiError(404, "No demo report available");
    }
    res.status(200).json({ success: true, data: analysis });
  }),

  /**
   * @swagger
   * /history:
   *   get:
   *     summary: List the current user's analyses (paginated)
   *     tags: [Analysis]
   *     security: [{ bearerAuth: [] }]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema: { type: integer, minimum: 1 }
   *       - in: query
   *         name: limit
   *         schema: { type: integer, minimum: 1, maximum: 50 }
   *     responses:
   *       200:
   *         description: Paginated history
   */
  history: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { page, limit } = req.query as unknown as PaginationInput;
    const { items, total } = await analysisService.history(userId, page, limit);
    res.status(200).json({
      success: true,
      data: { items, total, page, limit, pages: Math.ceil(total / limit) },
    });
  }),

  /**
   * @swagger
   * /analysis/{id}:
   *   get:
   *     summary: Get a single analysis (ownership required)
   *     tags: [Analysis]
   *     security: [{ bearerAuth: [] }]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200: { $ref: '#/components/responses/AnalysisSuccess' }
   *       404: { $ref: '#/components/responses/Error' }
   */
  getById: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params as unknown as ObjectIdInput;
    const analysis = await analysisService.getById(userId, id);
    if (!analysis) {
      throw new ApiError(404, "Analysis not found");
    }
    res.status(200).json({ success: true, data: analysis });
  }),

  /**
   * @swagger
   * /analysis/{id}:
   *   delete:
   *     summary: Delete an analysis (ownership required)
   *     tags: [Analysis]
   *     security: [{ bearerAuth: [] }]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Deleted
   */
  remove: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params as unknown as ObjectIdInput;
    const deleted = await analysisService.remove(userId, id);
    if (!deleted) {
      throw new ApiError(404, "Analysis not found");
    }
    res.status(200).json({ success: true, data: { message: "Analysis deleted" } });
  }),

  /**
   * @swagger
   * /analysis/{id}/pdf:
   *   get:
   *     summary: Download a PDF report for an analysis
   *     tags: [Analysis]
   *     security: [{ bearerAuth: [] }]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: PDF report
   *         content:
   *           application/pdf: {}
   *       404: { $ref: '#/components/responses/Error' }
   */
  downloadPdf: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params as unknown as ObjectIdInput;
    const analysis = await analysisService.getById(userId, id);
    if (!analysis) {
      throw new ApiError(404, "Analysis not found");
    }

    const pdf = await generatePdfReport(analysis);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="clearview-report-${analysis._id}.pdf"`
    );
    res.send(pdf);
  }),
};
