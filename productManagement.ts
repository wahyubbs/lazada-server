import axios from "axios";
import { appKey, secretKey, lazadaApiUrl, lazadaIdApiUrl } from ".";
import { generateSignature } from "./systemManagement";
/**
 * Create a product on Lazada.
 * @param {string} productName - Name of the product.
 * @param {number} price - Price of the product.
 * @param {string} description - Description of the product.
 * @param {string} imageUrl - URL of the product image.
 * @returns {Promise<void>} - A promise indicating the success of the operation.
 */
export async function createProduct(
  form: any,
  accessToken: string
): Promise<any> {
  const endpoint = "/product/create";
  const timestamp = Date.now();

  const commonParams = {
    app_key: appKey,
    sign_method: "sha256",
    timestamp,
    access_token: accessToken,
  };
  const product = {
    Request: {
      Product: {
        ...form,
      },
    },
  };
  const queryParams = { ...commonParams, payload: JSON.stringify(product) };
  const signature = generateSignature(endpoint, queryParams);

  try {
    const response = await axios.post(`${lazadaIdApiUrl}${endpoint}`, null, {
      params: { ...queryParams, sign: signature },
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });

    console.log("Product Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
export async function updateProduct(
  data: any,
  accessToken: string
): Promise<any> {
  const endpoint = "/product/price_quantity/update";
  const timestamp = Date.now();

  const commonParams = {
    app_key: appKey,
    sign_method: "sha256",
    timestamp,
    access_token: accessToken,
  };
  const product = {
    Request: {
      Product: {
        Skus: { Sku: [data] },
      },
    },
  };
  console.log(JSON.stringify(product));
  const queryParams = { ...commonParams, payload: JSON.stringify(product) };
  const signature = generateSignature(endpoint, queryParams);

  try {
    const response = await axios.post(`${lazadaIdApiUrl}${endpoint}`, null, {
      params: { ...queryParams, sign: signature },
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });

    console.log("Product updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
export async function uploadImageProduct(
  image: any,
  accessToken: string
): Promise<void> {
  const endpoint = "/image/upload";
  const timestamp = Date.now();

  const commonParams = {
    app_key: appKey,
    sign_method: "sha256",
    timestamp,
    access_token: accessToken,
  };

  const signature = generateSignature(endpoint, commonParams);

  try {
    const response = await axios.post(
      `${lazadaIdApiUrl}${endpoint}`,
      { image: image },
      {
        params: { ...commonParams, sign: signature },
        headers: { "Content-Type": "application/json;charset=utf-8" },
      }
    );

    console.log("Image Uploaded:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function getCategoryTree(accessToken: string): Promise<any> {
  const endpoint = "/category/tree/get";
  const timestamp = Date.now();
  const params = {
    app_key: appKey,
    sign_method: "sha256",
    timestamp,
    language_code: "id_ID",
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
export async function getCategoryAttribute(
  accessToken: string,
  primaryCategoryCode: string
): Promise<any> {
  const endpoint = "/category/attributes/get";
  const timestamp = Date.now();
  const params = {
    app_key: appKey,
    sign_method: "sha256",
    timestamp,
    primary_category_id: primaryCategoryCode,
    language_code: "id_ID",
    access_token: accessToken,
  };
  const signature = generateSignature(endpoint, params);
  try {
    const response = await axios.get(`${lazadaIdApiUrl}${endpoint}`, {
      params: { ...params, sign: signature },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

export async function getBrand(
  accessToken: string,
  startRow: string,
  pageSize: string
): Promise<any> {
  const endpoint = "/category/brands/query";
  const timestamp = Date.now();
  const params = {
    app_key: appKey,
    sign_method: "sha256",
    timestamp,
    startRow,
    pageSize,
    access_token: accessToken,
  };

  const signature = generateSignature(endpoint, params);
  try {
    const response = await axios.get(`${lazadaIdApiUrl}${endpoint}`, {
      params: { ...params, sign: signature },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
export async function getProduct(
  accessToken: string,
  filter: string,
  limit: string,
  sku_seller_list: string
): Promise<any> {
  const endpoint = "/products/get";
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
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
