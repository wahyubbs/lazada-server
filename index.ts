import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import {
  createProduct,
  getBrand,
  getCategoryAttribute,
  getCategoryTree,
  getProduct,
  updateProduct,
  uploadImageProduct,
} from "./productManagement";
import { getSeller } from "./sellerManagement";
import { generateAccessToken, generateRefreshToken } from "./systemManagement";

const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json({ limit: "50mb" }));
const port = 443;
export const appKey = "127361";
export const secretKey = "UPqXIbgX43AVFjXZ8rnWHMPUbzObUX0W";
export const lazadaApiUrl = "https://api.lazada.com/rest";
export const lazadaIdApiUrl = "https://api.lazada.co.id/rest";
export const redirectUri = "https://dpghqq12-5173.asse.devtunnels.ms/callback";

app.get("/auth", (_, res) => {
  const authorizationUrl = `https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=${redirectUri}&client_id=${appKey}&app_key=${appKey}`;
  res.redirect(authorizationUrl);
});

app.get("/token/create", async (req, res) => {
  const authorizationCode = req.query.code as string;

  const generateTokenParams = {
    code: authorizationCode,
    app_key: appKey,
    timestamp: Date.now(),
    sign_method: "sha256",
  };

  try {
    const responseToken = await generateAccessToken(generateTokenParams);
    const accessToken = responseToken.data.access_token;
    const refresh_token = responseToken.data.refresh_token;
    const expires_in = responseToken.data.expires_in;

    if (accessToken && refresh_token)
      res.send({
        token: accessToken,
        refresh_token: refresh_token,
        expired: expires_in,
        login_date: new Date(),
      });
    else res.status(400).send("generate access token fail");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/token/refresh", async (req, res) => {
  const authorizationCode = req.query.code as string;
  const refreshToken = req.query.refreshToken as string;

  const generateTokenParams = {
    code: authorizationCode,
    refresh_token: refreshToken,
    app_key: appKey,
    timestamp: Date.now(),
    sign_method: "sha256",
  };

  try {
    const responseToken = await generateRefreshToken(generateTokenParams);
    const accessToken = responseToken.data.access_token;
    res.send(accessToken);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/seller/info", async (req, res) => {
  const accessToken = req.body.access_token;
  try {
    let dataSeller = await getSeller(accessToken);
    res.send(dataSeller);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/product/categorytree", async (req, res) => {
  const accessToken = req.body.access_token;
  try {
    let dataCategory = await getCategoryTree(accessToken);
    res.send(dataCategory);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/product/categoryattribute", async (req, res) => {
  const accessToken = req.body.access_token;
  const primaryCategoryCode = req.body.primary_category_id;

  try {
    let dataCategory = await getCategoryAttribute(
      accessToken,
      primaryCategoryCode
    );
    console.log("categoryattribute:", dataCategory);
    res.send(dataCategory);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/product/brand", async (req, res) => {
  const accessToken = req.body.access_token;
  const startRow = req.body.start_row;
  const pageSize = req.body.page_size;

  try {
    let dataBrand = await getBrand(accessToken, startRow, pageSize);
    console.log("brand:", dataBrand);
    res.send(dataBrand);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/product/create", async (req, res) => {
  const accessToken = req.body.access_token;
  const form = req.body.form;

  try {
    const product = await createProduct(form, accessToken);
    console.log("product", product);
    res.send(product);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/product/update", async (req, res) => {
  const accessToken = req.body.access_token;
  const data = req.body.data;

  try {
    const product = await updateProduct(data, accessToken);
    console.log("product", product);
    res.send(product);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/product/get", async (req, res) => {
  const accessToken = req.body.access_token;
  const filter = req.body.filter;
  const limit = req.body.limit;
  const sku_seller_list = req.body.sku_seller_list;

  try {
    const product = await getProduct(
      accessToken,
      filter,
      limit,
      sku_seller_list
    );
    console.log("get product", JSON.stringify(product));
    res.send(product);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/image/upload", async (req, res) => {
  const accessToken = req.body.access_token;
  const image = req.body.image;
  console.log(image);
  try {
    const response = await uploadImageProduct(image, accessToken);
    console.log("image", response);
    res.send("upload image successful!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
