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
): Promise<void> {
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
        PrimaryCategory: "10100794",
        Images: {
          Image: [
            "https://sg-test-11.slatic.net/p/df43a20901802b1c223382951138719f.jpg",
          ],
        },
        Attributes: {
          name: "baju bbs",
          description: "TEST",
          brand: "No Brand",
          model: "test",
          waterproof: "Waterproof",
          warranty: "1 Month",
          short_description: "cm x 1efgtecm<br /><brfwefgtek",
          Hazmat: "None",
          material: "Leather",
          laptop_size: "11 - 12 inches",
          delivery_option_sof: "No",
          name_engravement: "Yes",
          gift_wrapping: "Yes",
          preorder_enable: "Yes",
          preorder_days: "25",
        },
        Skus: {
          Sku: [
            {
              SellerSku: "test2022 02",
              quantity: "3",
              price: "40000",
              special_price: "30000",
              special_from_date: "2022-06-20 17:18:31",
              special_to_date: "2025-03-15 17:18:31",
              package_height: "10",
              package_length: "10",
              package_width: "10",
              package_weight: "0.5",
              package_content: "laptop bag",
              Images: {
                Image: [
                  "https://sg-test-11.slatic.net/p/df43a20901802b1c223382951138719f.jpg",
                ],
              },
            },
          ],
        },
      },
    },
  };
  console.log(product);
  const queryParams = { ...commonParams };
  const signature = generateSignature(endpoint, queryParams);
  console.log(signature);

  try {
    const response = await axios.post(`${lazadaIdApiUrl}${endpoint}`, product, {
      params: { ...commonParams, sign: signature },
    });

    console.log("Product Created:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

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
