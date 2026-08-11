import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";
import { analysisRepository } from "../repositories/analysis.repository.js";
import { analysisService, type ApiAnalysis } from "./analysis.service.js";
import { logger } from "../utils/logger.js";

const DEMO_EMAIL = process.env.DEMO_EMAIL ?? "test@clearview.dev";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "Demo123!";
const DEMO_NAME = process.env.DEMO_NAME ?? "ClearView Demo";
const DEMO_URL = process.env.DEMO_URL ?? "https://example.com";

let reportInFlight: Promise<ApiAnalysis | null> | null = null;

/**
 * Self-seeding helpers so the deployed app needs no Shell access:
 * the demo user is ensured at startup, and the demo report is generated
 * lazily on the first request to GET /api/analysis/demo.
 */
export const demoService = {
  async ensureDemoUser() {
    const existing = await userRepository.findByEmail(DEMO_EMAIL);
    if (existing) {
      const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
      await userRepository.setPassword(String(existing._id), passwordHash);
      logger.info(`Demo user ready (password synced): ${DEMO_EMAIL}`);
      return existing;
    }
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
    const user = await userRepository.create({
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      passwordHash,
    });
    logger.info(`Created demo user: ${DEMO_EMAIL}`);
    return user;
  },

  async demoReport(): Promise<ApiAnalysis | null> {
    const existing = await analysisRepository.findDemoReport();
    if (existing) return existing;

    if (!reportInFlight) {
      reportInFlight = (async () => {
        try {
          const user = await demoService.ensureDemoUser();
          const { analysis } = await analysisService.ensureDemoReport(
            String(user._id),
            DEMO_URL
          );
          logger.info("Demo report generated on demand");
          return analysis;
        } catch (err) {
          logger.error("Demo report generation failed", {
            error: err instanceof Error ? err.message : String(err),
          });
          return null;
        } finally {
          reportInFlight = null;
        }
      })();
    }
    return reportInFlight;
  },
};
