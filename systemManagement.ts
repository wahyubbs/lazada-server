import axios from "axios";
import * as crypto from "crypto";
import { appKey, secretKey, lazadaApiUrl, lazadaIdApiUrl } from ".";

const generateTokenUrl = "https://auth.lazada.com/rest/auth/token/create";
const refreshTokenUrl = "https://auth.lazada.com/rest/auth/token/refresh";

/**
 * Generate Lazada API signature using HMAC-SHA256.
 * @param {string} url - API endpoint URL.
 * @param {Record<string, string>} params - API parameters.
 * @returns {string} - The generated signature.
 */

export function generateSignature(endpoint, params) {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}${params[key]}`)
    .join("");
  // Concatenate the method, endpoint, and sorted parameters
  const toSign = `${endpoint}${sortedParams}`;
  console.log(toSign);
  // Create the HMAC-SHA256 hash using the API secret
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(toSign)
    .digest("hex");

  return signature.toUpperCase();
}

export async function generateAccessToken(generateTokenParams: {
  code: string;
  app_key: string;
  timestamp: number;
  sign_method: string;
}) {
  const signature = generateSignature(
    "/auth/token/create",
    generateTokenParams
  );

  return await axios.post(
    generateTokenUrl,
    { ...generateTokenParams, sign: signature },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
}

export async function generateRefreshToken(generateTokenParams: {
  code: string;
  app_key: string;
  timestamp: number;
  sign_method: string;
  refresh_token: string;
}) {
  const signature = generateSignature(
    "/auth/token/refresh",
    generateTokenParams
  );

  return await axios.post(
    refreshTokenUrl,
    { ...generateTokenParams, sign: signature },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
}
