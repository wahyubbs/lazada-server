import axios from "axios";
import { appKey, lazadaIdApiUrl } from ".";
import { generateSignature } from "./systemManagement";

export async function getSeller(accessToken: string): Promise<any> {
  const endpoint = "/seller/get";
  const timestamp = Date.now();
  const params = {
    app_key: appKey,
    sign_method: "sha256",
    timestamp,
    access_token: accessToken,
  };

  const signature = generateSignature(endpoint, params);
  try {
    const response = await axios.get(`${lazadaIdApiUrl}${endpoint}`, {
      params: { ...params, sign: signature },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
