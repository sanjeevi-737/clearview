import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "../src/config/database.js";
import { userRepository } from "../src/repositories/user.repository.js";
import { analysisService } from "../src/services/analysis.service.js";
import { logger } from "../src/utils/logger.js";

const DEMO_EMAIL = process.env.DEMO_EMAIL ?? "test@clearview.dev";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "Demo123!";
const DEMO_URL = process.env.DEMO_URL ?? "https://example.com";

async function ensureDemoUser() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const existing = await userRepository.findByEmail(DEMO_EMAIL);
  if (existing) {
    await userRepository.setPassword(String(existing._id), passwordHash);
    logger.info(`Demo user ready (password synced): ${DEMO_EMAIL}`);
    return existing;
  }
  const user = await userRepository.create({
    name: "ClearView Demo",
    email: DEMO_EMAIL,
    passwordHash,
  });
  logger.info(`Created demo user: ${DEMO_EMAIL}`);
  return user;
}

async function main() {
  await connectDatabase();

  try {
    const user = await ensureDemoUser();
    logger.info(`Seeding demo analysis for ${DEMO_URL} ...`);
    const { analysis, fromCache } = await analysisService.ensureDemoReport(
      String(user._id),
      DEMO_URL
    );

    logger.info("Demo analysis ready:", {
      demoUserId: String(user._id),
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      url: analysis.url,
      title: analysis.title,
      readabilityScore: analysis.readabilityScore,
      clutterScore: analysis.clutterScore,
      cognitiveLoad: analysis.cognitiveLoad.score,
      fromCache,
      demo: analysis.demo,
    });
  } catch (err) {
    logger.error("Seeding failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

void main();
