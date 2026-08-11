import { lookup } from "node:dns/promises";
import { ApiError } from "./ApiError.js";

export function sanitizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function truncate(str: string, max: number): string {
  if (!str || str.length <= max) return str;
  return `${str.slice(0, max - 3).trimEnd()}...`;
}

export function cleanText(str: string): string {
  return str
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "")
    .trim();
}

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map((p) => Number(p));
  if (
    parts.length !== 4 ||
    parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)
  ) {
    return true;
  }
  const [a, b] = parts as [number, number, number, number];
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function isPrivateIp(ip: string): boolean {
  const value = ip.toLowerCase();
  if (value === "::1" || value === "::") return true;
  if (value.startsWith("::ffff:")) return isPrivateIpv4(value.slice(7));
  if (value.startsWith("fe80:")) return true;
  if (value.startsWith("fc") || value.startsWith("fd")) return true;
  return false;
}

export async function assertPublicHttpUrl(rawUrl: string): Promise<string> {
  const url = sanitizeUrl(rawUrl);

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new ApiError(422, "URL must be a valid http(s) address");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new ApiError(422, "Only http(s) URLs are allowed");
  }

  const hostname = parsed.hostname.replace(/^\[|\]$/g, "").toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new ApiError(422, "Local addresses are not allowed");
  }

  const looksLikeIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
  const looksLikeIpv6 = hostname.includes(":");

  if (looksLikeIpv4) {
    if (isPrivateIpv4(hostname)) {
      throw new ApiError(422, "Private or internal addresses are not allowed");
    }
  } else if (looksLikeIpv6) {
    if (isPrivateIp(hostname)) {
      throw new ApiError(422, "Private or internal addresses are not allowed");
    }
  } else {
    const addresses = await lookup(hostname, { all: true }).catch(() => {
      throw new ApiError(422, "URL could not be resolved");
    });
    if (addresses.some((entry) => isPrivateIp(entry.address))) {
      throw new ApiError(422, "Private or internal addresses are not allowed");
    }
  }

  return url;
}
