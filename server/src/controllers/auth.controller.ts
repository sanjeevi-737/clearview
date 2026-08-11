import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authService } from "../services/auth.service.js";
import type { LoginInput, RegisterInput } from "../validations/auth.schema.js";

export const authController = {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, password]
   *             properties:
   *               name: { type: string }
   *               email: { type: string, format: email }
   *               password: { type: string, minLength: 8 }
   *     responses:
   *       201: { $ref: '#/components/responses/AuthSuccess' }
   *       409: { $ref: '#/components/responses/Error' }
   */
  register: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as RegisterInput;
    const result = await authService.register(data);
    res.status(201).json({ success: true, data: result });
  }),

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Log in and receive a JWT
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email: { type: string, format: email }
   *               password: { type: string }
   *     responses:
   *       200: { $ref: '#/components/responses/AuthSuccess' }
   *       401: { $ref: '#/components/responses/Error' }
   */
  login: asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as LoginInput;
    const result = await authService.login(data);
    res.status(200).json({ success: true, data: result });
  }),

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Log out (stateless JWT — client discards the token)
   *     tags: [Auth]
   *     security: [{ bearerAuth: [] }]
   *     responses:
   *       200:
   *         description: Logged out
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success: { type: boolean, example: true }
   *                 data:
   *                   type: object
   *                   properties:
   *                     message: { type: string }
   */
  logout: asyncHandler(async (_req: Request, res: Response) => {
    const result = authService.logout();
    res.status(200).json({ success: true, data: result });
  }),
};
