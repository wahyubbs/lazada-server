"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// index.ts
var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);

// productManagement.ts
var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);

// systemManagement.ts

var _crypto = require('crypto'); var crypto = _interopRequireWildcard(_crypto);
var generateTokenUrl = "https://auth.lazada.com/rest/auth/token/create";
var refreshTokenUrl = "https://auth.lazada.com/rest/auth/token/refresh";
function generateSignature(endpoint, params) {
  const sortedParams = Object.keys(params).sort().map((key) => `${key}${params[key]}`).join("");
  const toSign = `${endpoint}${sortedParams}`;
  console.log(toSign);
  const signature = crypto.createHmac("sha256", secretKey).update(toSign).digest("hex");
  return signature.toUpperCase();
}
async function generateAccessToken(generateTokenParams) {
  const signature = generateSignature(
    "/auth/token/create",
    generateTokenParams
  );
  return await _axios2.default.post(
    generateTokenUrl,
    { ...generateTokenParams, sign: signature },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
}
async function generateRefreshToken(generateTokenParams) {
  const signature = generateSignature(
    "/auth/token/refresh",
    generateTokenParams
  );
  return await _axios2.default.post(
    refreshTokenUrl,
    { ...generateTokenParams, sign: signature },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
}

// productManagement.ts
async function createProduct(form, accessToken) {
  const endpoint = "/product/create";
  const timestamp = Date.now();
  const commonParams = {
    app_key: appKey2,
    sign_method: "sha256",
    timestamp,
    access_token: accessToken
  };
  const product = {
    Request: {
      Product: {
        ...form
      }
    }
  };
  const queryParams = { ...commonParams, payload: JSON.stringify(product) };
  const signature = generateSignature(endpoint, queryParams);
  try {
    const response = await _axios2.default.post(`${lazadaIdApiUrl2}${endpoint}`, null, {
      params: { ...queryParams, sign: signature },
      headers: { "Content-Type": "application/json;charset=utf-8" }
    });
    console.log("Product Created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
async function updateProduct(data, accessToken) {
  const endpoint = "/product/price_quantity/update";
  const timestamp = Date.now();
  const commonParams = {
    app_key: appKey2,
    sign_method: "sha256",
    timestamp,
    access_token: accessToken
  };
  const product = {
    Request: {
      Product: {
        Skus: { Sku: [data] }
      }
    }
  };
  console.log(JSON.stringify(product));
  const queryParams = { ...commonParams, payload: JSON.stringify(product) };
  const signature = generateSignature(endpoint, queryParams);
  try {
    const response = await _axios2.default.post(`${lazadaIdApiUrl2}${endpoint}`, null, {
      params: { ...queryParams, sign: signature },
      headers: { "Content-Type": "application/json;charset=utf-8" }
    });
    console.log("Product updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
async function uploadImageProduct(image, accessToken) {
  const endpoint = "/image/upload";
  const timestamp = Date.now();
  const commonParams = {
    app_key: appKey2,
    sign_method: "sha256",
    timestamp,
    access_token: accessToken
  };
  const signature = generateSignature(endpoint, commonParams);
  try {
    const response = await _axios2.default.post(
      `${lazadaIdApiUrl2}${endpoint}`,
      { image },
      {
        params: { ...commonParams, sign: signature },
        headers: { "Content-Type": "application/json;charset=utf-8" }
      }
    );
    console.log("Image Uploaded:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
async function getCategoryTree(accessToken) {
  const endpoint = "/category/tree/get";
  const timestamp = Date.now();
  const params = {
    app_key: appKey2,
    sign_method: "sha256",
    timestamp,
    language_code: "id_ID",
    access_token: accessToken
  };
  const signature = generateSignature(endpoint, params);
  try {
    const response = await _axios2.default.get(`${lazadaIdApiUrl2}${endpoint}`, {
      params: { ...params, sign: signature }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
async function getCategoryAttribute(accessToken, primaryCategoryCode) {
  const endpoint = "/category/attributes/get";
  const timestamp = Date.now();
  const params = {
    app_key: appKey2,
    sign_method: "sha256",
    timestamp,
    primary_category_id: primaryCategoryCode,
    language_code: "id_ID",
    access_token: accessToken
  };
  const signature = generateSignature(endpoint, params);
  try {
    const response = await _axios2.default.get(`${lazadaIdApiUrl2}${endpoint}`, {
      params: { ...params, sign: signature }
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
async function getBrand(accessToken, startRow, pageSize) {
  const endpoint = "/category/brands/query";
  const timestamp = Date.now();
  const params = {
    app_key: appKey2,
    sign_method: "sha256",
    timestamp,
    startRow,
    pageSize,
    access_token: accessToken
  };
  const signature = generateSignature(endpoint, params);
  try {
    const response = await _axios2.default.get(`${lazadaIdApiUrl2}${endpoint}`, {
      params: { ...params, sign: signature }
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
async function getProduct(accessToken, filter, limit, sku_seller_list) {
  const endpoint = "/products/get";
  const timestamp = Date.now();
  const params = {
    app_key: appKey2,
    sign_method: "sha256",
    timestamp,
    access_token: accessToken
  };
  const signature = generateSignature(endpoint, params);
  try {
    const response = await _axios2.default.get(`${lazadaIdApiUrl2}${endpoint}`, {
      params: { ...params, sign: signature }
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// sellerManagement.ts

async function getSeller(accessToken) {
  const endpoint = "/seller/get";
  const timestamp = Date.now();
  const params = {
    app_key: appKey2,
    sign_method: "sha256",
    timestamp,
    access_token: accessToken
  };
  const signature = generateSignature(endpoint, params);
  try {
    const response = await _axios2.default.get(`${lazadaIdApiUrl2}${endpoint}`, {
      params: { ...params, sign: signature }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// index.ts
var app = _express2.default.call(void 0, );
app.use(_cors2.default.call(void 0, ));
app.options("*", _cors2.default.call(void 0, ));
app.use(_express2.default.json({ limit: "50mb" }));
var port = 443;
var appKey2 = "127361";
var secretKey = "UPqXIbgX43AVFjXZ8rnWHMPUbzObUX0W";
var lazadaApiUrl3 = "https://api.lazada.com/rest";
var lazadaIdApiUrl2 = "https://api.lazada.co.id/rest";
var redirectUri = "https://dpghqq12-5173.asse.devtunnels.ms/callback";
app.get("/auth", (_, res) => {
  const authorizationUrl = `https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=${redirectUri}&client_id=${appKey2}&app_key=${appKey2}`;
  res.redirect(authorizationUrl);
});
app.get("/token/create", async (req, res) => {
  const authorizationCode = req.query.code;
  const generateTokenParams = {
    code: authorizationCode,
    app_key: appKey2,
    timestamp: Date.now(),
    sign_method: "sha256"
  };
  try {
    const responseToken = await generateAccessToken(generateTokenParams);
    const accessToken = responseToken.data.access_token;
    const refresh_token = responseToken.data.refresh_token;
    const expires_in = responseToken.data.expires_in;
    if (accessToken && refresh_token)
      res.send({
        token: accessToken,
        refresh_token,
        expired: expires_in,
        login_date: /* @__PURE__ */ new Date()
      });
    else
      res.status(400).send("generate access token fail");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/token/refresh", async (req, res) => {
  const authorizationCode = req.query.code;
  const refreshToken = req.query.refreshToken;
  const generateTokenParams = {
    code: authorizationCode,
    refresh_token: refreshToken,
    app_key: appKey2,
    timestamp: Date.now(),
    sign_method: "sha256"
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






exports.appKey = appKey2; exports.lazadaApiUrl = lazadaApiUrl3; exports.lazadaIdApiUrl = lazadaIdApiUrl2; exports.redirectUri = redirectUri; exports.secretKey = secretKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LnRzIiwiLi4vcHJvZHVjdE1hbmFnZW1lbnQudHMiLCIuLi9zeXN0ZW1NYW5hZ2VtZW50LnRzIiwiLi4vc2VsbGVyTWFuYWdlbWVudC50cyJdLCJuYW1lcyI6WyJheGlvcyIsImFwcEtleSIsImxhemFkYUlkQXBpVXJsIiwibGF6YWRhQXBpVXJsIl0sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sVUFBVTs7O0FDRGpCLE9BQU9BLFlBQVc7OztBQ0FsQixPQUFPLFdBQVc7QUFDbEIsWUFBWSxZQUFZO0FBR3hCLElBQU0sbUJBQW1CO0FBQ3pCLElBQU0sa0JBQWtCO0FBU2pCLFNBQVMsa0JBQWtCLFVBQVUsUUFBUTtBQUVsRCxRQUFNLGVBQWUsT0FBTyxLQUFLLE1BQU0sRUFDcEMsS0FBSyxFQUNMLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxHQUFHLE9BQU8sR0FBRyxDQUFDLEVBQUUsRUFDbkMsS0FBSyxFQUFFO0FBRVYsUUFBTSxTQUFTLEdBQUcsUUFBUSxHQUFHLFlBQVk7QUFDekMsVUFBUSxJQUFJLE1BQU07QUFFbEIsUUFBTSxZQUNILGtCQUFXLFVBQVUsU0FBUyxFQUM5QixPQUFPLE1BQU0sRUFDYixPQUFPLEtBQUs7QUFFZixTQUFPLFVBQVUsWUFBWTtBQUMvQjtBQUVBLGVBQXNCLG9CQUFvQixxQkFLdkM7QUFDRCxRQUFNLFlBQVk7QUFBQSxJQUNoQjtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBRUEsU0FBTyxNQUFNLE1BQU07QUFBQSxJQUNqQjtBQUFBLElBQ0EsRUFBRSxHQUFHLHFCQUFxQixNQUFNLFVBQVU7QUFBQSxJQUMxQztBQUFBLE1BQ0UsU0FBUztBQUFBLFFBQ1AsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBRUEsZUFBc0IscUJBQXFCLHFCQU14QztBQUNELFFBQU0sWUFBWTtBQUFBLElBQ2hCO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFFQSxTQUFPLE1BQU0sTUFB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QUFDdkIsUUFBTSxrQkFBa0IsSUFBSSxLQUFLO0FBRWpDLE1BQUk7QUFDRixVQUFNLFVBQVUsTUFBTTtBQUFBLE1BQ3BCO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUNBLFlBQVEsSUFBSSxlQUFlLEtBQUssVUFBVSxPQUFPLENBQUM7QUFDbEQsUUFBSSxLQUFLLE9BQU87QUFBQSxFQUNsQixTQUFTLE9BQU87QUFDZCxZQUFRLE1BQU0sVUFBVSxNQUFNLE9BQU87QUFDckMsUUFBSSxPQUFPLEdBQUcsRUFBRSxLQUFLLHVCQUF1QjtBQUFBLEVBQzlDO0FBQ0YsQ0FBQztBQUNELElBQUksS0FBSyxpQkFBaUIsT0FBTyxLQUFLLFFBQVE7QUFDNUMsUUFBTSxjQUFjLElBQUksS0FBSztBQUM3QixRQUFNLFFBQVEsSUFBSSxLQUFLO0FBQ3ZCLFVBQVEsSUFBSSxLQUFLO0FBQ2pCLE1BQUk7QUFDRixVQUFNLFdBQVcsTUFBTSxtQkFBbUIsT0FBTyxXQUFXO0FBQzVELFlBQVEsSUFBSSxTQUFTLFFBQVE7QUFDN0IsUUFBSSxLQUFLLDBCQUEwQjtBQUFBLEVBQ3JDLFNBQVMsT0FBTztBQUNkLFlBQVEsTUFBTSxVQUFVLEtBQUs7QUFDN0IsUUFBSSxPQUFPLEdBQUcsRUFBRSxLQUFLLHVCQUF1QjtBQUFBLEVBQzlDO0FBQ0YsQ0FBQztBQUVELElBQUksT0FBTyxNQUFNLE1BQU07QUFDckIsVUFBUSxJQUFJLHlDQUF5QyxJQUFJLEVBQUU7QUFDN0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCBjb3JzIGZyb20gXCJjb3JzXCI7XHJcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gXCJib2R5LXBhcnNlclwiO1xyXG5cclxuaW1wb3J0IHtcclxuICBjcmVhdGVQcm9kdWN0LFxyXG4gIGdldEJyYW5kLFxyXG4gIGdldENhdGVnb3J5QXR0cmlidXRlLFxyXG4gIGdldENhdGVnb3J5VHJlZSxcclxuICBnZXRQcm9kdWN0LFxyXG4gIHVwZGF0ZVByb2R1Y3QsXHJcbiAgdXBsb2FkSW1hZ2VQcm9kdWN0LFxyXG59IGZyb20gXCIuL3Byb2R1Y3RNYW5hZ2VtZW50XCI7XHJcbmltcG9ydCB7IGdldFNlbGxlciB9IGZyb20gXCIuL3NlbGxlck1hbmFnZW1lbnRcIjtcclxuaW1wb3J0IHsgZ2VuZXJhdGVBY2Nlc3NUb2tlbiwgZ2VuZXJhdGVSZWZyZXNoVG9rZW4gfSBmcm9tIFwiLi9zeXN0ZW1NYW5hZ2VtZW50XCI7XHJcblxyXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XHJcbmFwcC51c2UoY29ycygpKTtcclxuYXBwLm9wdGlvbnMoXCIqXCIsIGNvcnMoKSk7XHJcbmFwcC51c2UoZXhwcmVzcy5qc29uKHsgbGltaXQ6IFwiNTBtYlwiIH0pKTtcclxuY29uc3QgcG9ydCA9IDQ0MztcclxuZXhwb3J0IGNvbnN0IGFwcEtleSA9IFwiMTI3MzYxXCI7XHJcbmV4cG9ydCBjb25zdCBzZWNyZXRLZXkgPSBcIlVQcVhJYmdYNDNBVkZqWFo4cm5XSE1QVWJ6T2JVWDBXXCI7XHJcbmV4cG9ydCBjb25zdCBsYXphZGFBcGlVcmwgPSBcImh0dHBzOi8vYXBpLmxhemFkYS5jb20vcmVzdFwiO1xyXG5leHBvcnQgY29uc3QgbGF6YWRhSWRBcGlVcmwgPSBcImh0dHBzOi8vYXBpLmxhemFkYS5jby5pZC9yZXN0XCI7XHJcbmV4cG9ydCBjb25zdCByZWRpcmVjdFVyaSA9IFwiaHR0cHM6Ly9kcGdocXExMi01MTczLmFzc2UuZGV2dHVubmVscy5tcy9jYWxsYmFja1wiO1xyXG5cclxuYXBwLmdldChcIi9hdXRoXCIsIChfLCByZXMpID0+IHtcclxuICBjb25zdCBhdXRob3JpemF0aW9uVXJsID0gYGh0dHBzOi8vYXV0aC5sYXphZGEuY29tL29hdXRoL2F1dGhvcml6ZT9yZXNwb25zZV90eXBlPWNvZGUmZm9yY2VfYXV0aD10cnVlJnJlZGlyZWN0X3VyaT0ke3JlZGlyZWN0VXJpfSZjbGllbnRfaWQ9JHthcHBLZXl9JmFwcF9rZXk9JHthcHBLZXl9YDtcclxuICByZXMucmVkaXJlY3QoYXV0aG9yaXphdGlvblVybCk7XHJcbn0pO1xyXG5cclxuYXBwLmdldChcIi90b2tlbi9jcmVhdGVcIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc3QgYXV0aG9yaXphdGlvbkNvZGUgPSByZXEucXVlcnkuY29kZSBhcyBzdHJpbmc7XHJcblxyXG4gIGNvbnN0IGdlbmVyYXRlVG9rZW5QYXJhbXMgPSB7XHJcbiAgICBjb2RlOiBhdXRob3JpemF0aW9uQ29kZSxcclxuICAgIGFwcF9rZXk6IGFwcEtleSxcclxuICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcclxuICAgIHNpZ25fbWV0aG9kOiBcInNoYTI1NlwiLFxyXG4gIH07XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZVRva2VuID0gYXdhaXQgZ2VuZXJhdGVBY2Nlc3NUb2tlbihnZW5lcmF0ZVRva2VuUGFyYW1zKTtcclxuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gcmVzcG9uc2VUb2tlbi5kYXRhLmFjY2Vzc190b2tlbjtcclxuICAgIGNvbnN0IHJlZnJlc2hfdG9rZW4gPSByZXNwb25zZVRva2VuLmRhdGEucmVmcmVzaF90b2tlbjtcclxuICAgIGNvbnN0IGV4cGlyZXNfaW4gPSByZXNwb25zZVRva2VuLmRhdGEuZXhwaXJlc19pbjtcclxuXHJcbiAgICBpZiAoYWNjZXNzVG9rZW4gJiYgcmVmcmVzaF90b2tlbilcclxuICAgICAgcmVzLnNlbmQoe1xyXG4gICAgICAgIHRva2VuOiBhY2Nlc3NUb2tlbixcclxuICAgICAgICByZWZyZXNoX3Rva2VuOiByZWZyZXNoX3Rva2VuLFxyXG4gICAgICAgIGV4cGlyZWQ6IGV4cGlyZXNfaW4sXHJcbiAgICAgICAgbG9naW5fZGF0ZTogbmV3IERhdGUoKSxcclxuICAgICAgfSk7XHJcbiAgICBlbHNlIHJlcy5zdGF0dXMoNDAwKS5zZW5kKFwiZ2VuZXJhdGUgYWNjZXNzIHRva2VuIGZhaWxcIik7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjpcIiwgZXJyb3IubWVzc2FnZSk7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChcIkludGVybmFsIFNlcnZlciBFcnJvclwiKTtcclxuICB9XHJcbn0pO1xyXG5hcHAuZ2V0KFwiL3Rva2VuL3JlZnJlc2hcIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc3QgYXV0aG9yaXphdGlvbkNvZGUgPSByZXEucXVlcnkuY29kZSBhcyBzdHJpbmc7XHJcbiAgY29uc3QgcmVmcmVzaFRva2VuID0gcmVxLnF1ZXJ5LnJlZnJlc2hUb2tlbiBhcyBzdHJpbmc7XHJcblxyXG4gIGNvbnN0IGdlbmVyYXRlVG9rZW5QYXJhbXMgPSB7XHJcbiAgICBjb2RlOiBhdXRob3JpemF0aW9uQ29kZSxcclxuICAgIHJlZnJlc2hfdG9rZW46IHJlZnJlc2hUb2tlbixcclxuICAgIGFwcF9rZXk6IGFwcEtleSxcclxuICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcclxuICAgIHNpZ25fbWV0aG9kOiBcInNoYTI1NlwiLFxyXG4gIH07XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZVRva2VuID0gYXdhaXQgZ2VuZXJhdGVSZWZyZXNoVG9rZW4oZ2VuZXJhdGVUb2tlblBhcmFtcyk7XHJcbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlc3BvbnNlVG9rZW4uZGF0YS5hY2Nlc3NfdG9rZW47XHJcbiAgICByZXMuc2VuZChhY2Nlc3NUb2tlbik7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjpcIiwgZXJyb3IubWVzc2FnZSk7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChcIkludGVybmFsIFNlcnZlciBFcnJvclwiKTtcclxuICB9XHJcbn0pO1xyXG5hcHAucG9zdChcIi9zZWxsZXIvaW5mb1wiLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlcS5ib2R5LmFjY2Vzc190b2tlbjtcclxuICB0cnkge1xyXG4gICAgbGV0IGRhdGFTZWxsZXIgPSBhd2FpdCBnZXRTZWxsZXIoYWNjZXNzVG9rZW4pO1xyXG4gICAgcmVzLnNlbmQoZGF0YVNlbGxlcik7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjpcIiwgZXJyb3IubWVzc2FnZSk7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChcIkludGVybmFsIFNlcnZlciBFcnJvclwiKTtcclxuICB9XHJcbn0pO1xyXG5hcHAucG9zdChcIi9wcm9kdWN0L2NhdGVnb3J5dHJlZVwiLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlcS5ib2R5LmFjY2Vzc190b2tlbjtcclxuICB0cnkge1xyXG4gICAgbGV0IGRhdGFDYXRlZ29yeSA9IGF3YWl0IGdldENhdGVnb3J5VHJlZShhY2Nlc3NUb2tlbik7XHJcbiAgICByZXMuc2VuZChkYXRhQ2F0ZWdvcnkpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoXCJJbnRlcm5hbCBTZXJ2ZXIgRXJyb3JcIik7XHJcbiAgfVxyXG59KTtcclxuYXBwLnBvc3QoXCIvcHJvZHVjdC9jYXRlZ29yeWF0dHJpYnV0ZVwiLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlcS5ib2R5LmFjY2Vzc190b2tlbjtcclxuICBjb25zdCBwcmltYXJ5Q2F0ZWdvcnlDb2RlID0gcmVxLmJvZHkucHJpbWFyeV9jYXRlZ29yeV9pZDtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGxldCBkYXRhQ2F0ZWdvcnkgPSBhd2FpdCBnZXRDYXRlZ29yeUF0dHJpYnV0ZShcclxuICAgICAgYWNjZXNzVG9rZW4sXHJcbiAgICAgIHByaW1hcnlDYXRlZ29yeUNvZGVcclxuICAgICk7XHJcbiAgICBjb25zb2xlLmxvZyhcImNhdGVnb3J5YXR0cmlidXRlOlwiLCBkYXRhQ2F0ZWdvcnkpO1xyXG4gICAgcmVzLnNlbmQoZGF0YUNhdGVnb3J5KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yOlwiLCBlcnJvci5tZXNzYWdlKTtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKFwiSW50ZXJuYWwgU2VydmVyIEVycm9yXCIpO1xyXG4gIH1cclxufSk7XHJcbmFwcC5wb3N0KFwiL3Byb2R1Y3QvYnJhbmRcIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc3QgYWNjZXNzVG9rZW4gPSByZXEuYm9keS5hY2Nlc3NfdG9rZW47XHJcbiAgY29uc3Qgc3RhcnRSb3cgPSByZXEuYm9keS5zdGFydF9yb3c7XHJcbiAgY29uc3QgcGFnZVNpemUgPSByZXEuYm9keS5wYWdlX3NpemU7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBsZXQgZGF0YUJyYW5kID0gYXdhaXQgZ2V0QnJhbmQoYWNjZXNzVG9rZW4sIHN0YXJ0Um93LCBwYWdlU2l6ZSk7XHJcbiAgICBjb25zb2xlLmxvZyhcImJyYW5kOlwiLCBkYXRhQnJhbmQpO1xyXG4gICAgcmVzLnNlbmQoZGF0YUJyYW5kKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yOlwiLCBlcnJvci5tZXNzYWdlKTtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKFwiSW50ZXJuYWwgU2VydmVyIEVycm9yXCIpO1xyXG4gIH1cclxufSk7XHJcbmFwcC5wb3N0KFwiL3Byb2R1Y3QvY3JlYXRlXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIGNvbnN0IGFjY2Vzc1Rva2VuID0gcmVxLmJvZHkuYWNjZXNzX3Rva2VuO1xyXG4gIGNvbnN0IGZvcm0gPSByZXEuYm9keS5mb3JtO1xyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgcHJvZHVjdCA9IGF3YWl0IGNyZWF0ZVByb2R1Y3QoZm9ybSwgYWNjZXNzVG9rZW4pO1xyXG4gICAgY29uc29sZS5sb2coXCJwcm9kdWN0XCIsIHByb2R1Y3QpO1xyXG4gICAgcmVzLnNlbmQocHJvZHVjdCk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjpcIiwgZXJyb3IubWVzc2FnZSk7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChcIkludGVybmFsIFNlcnZlciBFcnJvclwiKTtcclxuICB9XHJcbn0pO1xyXG5hcHAucG9zdChcIi9wcm9kdWN0L3VwZGF0ZVwiLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlcS5ib2R5LmFjY2Vzc190b2tlbjtcclxuICBjb25zdCBkYXRhID0gcmVxLmJvZHkuZGF0YTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHByb2R1Y3QgPSBhd2FpdCB1cGRhdGVQcm9kdWN0KGRhdGEsIGFjY2Vzc1Rva2VuKTtcclxuICAgIGNvbnNvbGUubG9nKFwicHJvZHVjdFwiLCBwcm9kdWN0KTtcclxuICAgIHJlcy5zZW5kKHByb2R1Y3QpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoXCJJbnRlcm5hbCBTZXJ2ZXIgRXJyb3JcIik7XHJcbiAgfVxyXG59KTtcclxuYXBwLnBvc3QoXCIvcHJvZHVjdC9nZXRcIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc3QgYWNjZXNzVG9rZW4gPSByZXEuYm9keS5hY2Nlc3NfdG9rZW47XHJcbiAgY29uc3QgZmlsdGVyID0gcmVxLmJvZHkuZmlsdGVyO1xyXG4gIGNvbnN0IGxpbWl0ID0gcmVxLmJvZHkubGltaXQ7XHJcbiAgY29uc3Qgc2t1X3NlbGxlcl9saXN0ID0gcmVxLmJvZHkuc2t1X3NlbGxlcl9saXN0O1xyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgcHJvZHVjdCA9IGF3YWl0IGdldFByb2R1Y3QoXHJcbiAgICAgIGFjY2Vzc1Rva2VuLFxyXG4gICAgICBmaWx0ZXIsXHJcbiAgICAgIGxpbWl0LFxyXG4gICAgICBza3Vfc2VsbGVyX2xpc3RcclxuICAgICk7XHJcbiAgICBjb25zb2xlLmxvZyhcImdldCBwcm9kdWN0XCIsIEpTT04uc3RyaW5naWZ5KHByb2R1Y3QpKTtcclxuICAgIHJlcy5zZW5kKHByb2R1Y3QpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoXCJJbnRlcm5hbCBTZXJ2ZXIgRXJyb3JcIik7XHJcbiAgfVxyXG59KTtcclxuYXBwLnBvc3QoXCIvaW1hZ2UvdXBsb2FkXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIGNvbnN0IGFjY2Vzc1Rva2VuID0gcmVxLmJvZHkuYWNjZXNzX3Rva2VuO1xyXG4gIGNvbnN0IGltYWdlID0gcmVxLmJvZHkuaW1hZ2U7XHJcbiAgY29uc29sZS5sb2coaW1hZ2UpO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHVwbG9hZEltYWdlUHJvZHVjdChpbWFnZSwgYWNjZXNzVG9rZW4pO1xyXG4gICAgY29uc29sZS5sb2coXCJpbWFnZVwiLCByZXNwb25zZSk7XHJcbiAgICByZXMuc2VuZChcInVwbG9hZCBpbWFnZSBzdWNjZXNzZnVsIVwiKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yOlwiLCBlcnJvcik7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChcIkludGVybmFsIFNlcnZlciBFcnJvclwiKTtcclxuICB9XHJcbn0pO1xyXG5cclxuYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7XHJcbiAgY29uc29sZS5sb2coYFNlcnZlciBpcyBydW5uaW5nIGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fWApO1xyXG59KTtcclxuIiwiaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xyXG5pbXBvcnQgeyBhcHBLZXksIHNlY3JldEtleSwgbGF6YWRhQXBpVXJsLCBsYXphZGFJZEFwaVVybCB9IGZyb20gXCIuXCI7XHJcbmltcG9ydCB7IGdlbmVyYXRlU2lnbmF0dXJlIH0gZnJvbSBcIi4vc3lzdGVtTWFuYWdlbWVudFwiO1xyXG4vKipcclxuICogQ3JlYXRlIGEgcHJvZHVjdCBvbiBMYXphZGEuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9kdWN0TmFtZSAtIE5hbWUgb2YgdGhlIHByb2R1Y3QuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBwcmljZSAtIFByaWNlIG9mIHRoZSBwcm9kdWN0LlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb24gLSBEZXNjcmlwdGlvbiBvZiB0aGUgcHJvZHVjdC5cclxuICogQHBhcmFtIHtzdHJpbmd9IGltYWdlVXJsIC0gVVJMIG9mIHRoZSBwcm9kdWN0IGltYWdlLlxyXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gLSBBIHByb21pc2UgaW5kaWNhdGluZyB0aGUgc3VjY2VzcyBvZiB0aGUgb3BlcmF0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVByb2R1Y3QoXHJcbiAgZm9ybTogYW55LFxyXG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmdcclxuKTogUHJvbWlzZTxhbnk+IHtcclxuICBjb25zdCBlbmRwb2ludCA9IFwiL3Byb2R1Y3QvY3JlYXRlXCI7XHJcbiAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcclxuXHJcbiAgY29uc3QgY29tbW9uUGFyYW1zID0ge1xyXG4gICAgYXBwX2tleTogYXBwS2V5LFxyXG4gICAgc2lnbl9tZXRob2Q6IFwic2hhMjU2XCIsXHJcbiAgICB0aW1lc3RhbXAsXHJcbiAgICBhY2Nlc3NfdG9rZW46IGFjY2Vzc1Rva2VuLFxyXG4gIH07XHJcbiAgY29uc3QgcHJvZHVjdCA9IHtcclxuICAgIFJlcXVlc3Q6IHtcclxuICAgICAgUHJvZHVjdDoge1xyXG4gICAgICAgIC4uLmZvcm0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH07XHJcbiAgY29uc3QgcXVlcnlQYXJhbXMgPSB7IC4uLmNvbW1vblBhcmFtcywgcGF5bG9hZDogSlNPTi5zdHJpbmdpZnkocHJvZHVjdCkgfTtcclxuICBjb25zdCBzaWduYXR1cmUgPSBnZW5lcmF0ZVNpZ25hdHVyZShlbmRwb2ludCwgcXVlcnlQYXJhbXMpO1xyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KGAke2xhemFkYUlkQXBpVXJsfSR7ZW5kcG9pbnR9YCwgbnVsbCwge1xyXG4gICAgICBwYXJhbXM6IHsgLi4ucXVlcnlQYXJhbXMsIHNpZ246IHNpZ25hdHVyZSB9LFxyXG4gICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04XCIgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiUHJvZHVjdCBDcmVhdGVkOlwiLCByZXNwb25zZS5kYXRhKTtcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgdGhyb3cgZXJyb3I7XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVQcm9kdWN0KFxyXG4gIGRhdGE6IGFueSxcclxuICBhY2Nlc3NUb2tlbjogc3RyaW5nXHJcbik6IFByb21pc2U8YW55PiB7XHJcbiAgY29uc3QgZW5kcG9pbnQgPSBcIi9wcm9kdWN0L3ByaWNlX3F1YW50aXR5L3VwZGF0ZVwiO1xyXG4gIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcblxyXG4gIGNvbnN0IGNvbW1vblBhcmFtcyA9IHtcclxuICAgIGFwcF9rZXk6IGFwcEtleSxcclxuICAgIHNpZ25fbWV0aG9kOiBcInNoYTI1NlwiLFxyXG4gICAgdGltZXN0YW1wLFxyXG4gICAgYWNjZXNzX3Rva2VuOiBhY2Nlc3NUb2tlbixcclxuICB9O1xyXG4gIGNvbnN0IHByb2R1Y3QgPSB7XHJcbiAgICBSZXF1ZXN0OiB7XHJcbiAgICAgIFByb2R1Y3Q6IHtcclxuICAgICAgICBTa3VzOiB7IFNrdTogW2RhdGFdIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH07XHJcbiAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocHJvZHVjdCkpO1xyXG4gIGNvbnN0IHF1ZXJ5UGFyYW1zID0geyAuLi5jb21tb25QYXJhbXMsIHBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHByb2R1Y3QpIH07XHJcbiAgY29uc3Qgc2lnbmF0dXJlID0gZ2VuZXJhdGVTaWduYXR1cmUoZW5kcG9pbnQsIHF1ZXJ5UGFyYW1zKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdChgJHtsYXphZGFJZEFwaVVybH0ke2VuZHBvaW50fWAsIG51bGwsIHtcclxuICAgICAgcGFyYW1zOiB7IC4uLnF1ZXJ5UGFyYW1zLCBzaWduOiBzaWduYXR1cmUgfSxcclxuICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOFwiIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIlByb2R1Y3QgdXBkYXRlZDpcIiwgcmVzcG9uc2UuZGF0YSk7XHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yOlwiLCBlcnJvci5tZXNzYWdlKTtcclxuICAgIHRocm93IGVycm9yO1xyXG4gIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBsb2FkSW1hZ2VQcm9kdWN0KFxyXG4gIGltYWdlOiBhbnksXHJcbiAgYWNjZXNzVG9rZW46IHN0cmluZ1xyXG4pOiBQcm9taXNlPHZvaWQ+IHtcclxuICBjb25zdCBlbmRwb2ludCA9IFwiL2ltYWdlL3VwbG9hZFwiO1xyXG4gIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcblxyXG4gIGNvbnN0IGNvbW1vblBhcmFtcyA9IHtcclxuICAgIGFwcF9rZXk6IGFwcEtleSxcclxuICAgIHNpZ25fbWV0aG9kOiBcInNoYTI1NlwiLFxyXG4gICAgdGltZXN0YW1wLFxyXG4gICAgYWNjZXNzX3Rva2VuOiBhY2Nlc3NUb2tlbixcclxuICB9O1xyXG5cclxuICBjb25zdCBzaWduYXR1cmUgPSBnZW5lcmF0ZVNpZ25hdHVyZShlbmRwb2ludCwgY29tbW9uUGFyYW1zKTtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdChcclxuICAgICAgYCR7bGF6YWRhSWRBcGlVcmx9JHtlbmRwb2ludH1gLFxyXG4gICAgICB7IGltYWdlOiBpbWFnZSB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgcGFyYW1zOiB7IC4uLmNvbW1vblBhcmFtcywgc2lnbjogc2lnbmF0dXJlIH0sXHJcbiAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOFwiIH0sXHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJJbWFnZSBVcGxvYWRlZDpcIiwgcmVzcG9uc2UuZGF0YSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjpcIiwgZXJyb3IubWVzc2FnZSk7XHJcbiAgICB0aHJvdyBlcnJvcjtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDYXRlZ29yeVRyZWUoYWNjZXNzVG9rZW46IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgY29uc3QgZW5kcG9pbnQgPSBcIi9jYXRlZ29yeS90cmVlL2dldFwiO1xyXG4gIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgYXBwX2tleTogYXBwS2V5LFxyXG4gICAgc2lnbl9tZXRob2Q6IFwic2hhMjU2XCIsXHJcbiAgICB0aW1lc3RhbXAsXHJcbiAgICBsYW5ndWFnZV9jb2RlOiBcImlkX0lEXCIsXHJcbiAgICBhY2Nlc3NfdG9rZW46IGFjY2Vzc1Rva2VuLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IGdlbmVyYXRlU2lnbmF0dXJlKGVuZHBvaW50LCBwYXJhbXMpO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChgJHtsYXphZGFJZEFwaVVybH0ke2VuZHBvaW50fWAsIHtcclxuICAgICAgcGFyYW1zOiB7IC4uLnBhcmFtcywgc2lnbjogc2lnbmF0dXJlIH0sXHJcbiAgICB9KTtcclxuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjpcIiwgZXJyb3IubWVzc2FnZSk7XHJcbiAgICB0aHJvdyBlcnJvcjtcclxuICB9XHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENhdGVnb3J5QXR0cmlidXRlKFxyXG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmcsXHJcbiAgcHJpbWFyeUNhdGVnb3J5Q29kZTogc3RyaW5nXHJcbik6IFByb21pc2U8YW55PiB7XHJcbiAgY29uc3QgZW5kcG9pbnQgPSBcIi9jYXRlZ29yeS9hdHRyaWJ1dGVzL2dldFwiO1xyXG4gIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgYXBwX2tleTogYXBwS2V5LFxyXG4gICAgc2lnbl9tZXRob2Q6IFwic2hhMjU2XCIsXHJcbiAgICB0aW1lc3RhbXAsXHJcbiAgICBwcmltYXJ5X2NhdGVnb3J5X2lkOiBwcmltYXJ5Q2F0ZWdvcnlDb2RlLFxyXG4gICAgbGFuZ3VhZ2VfY29kZTogXCJpZF9JRFwiLFxyXG4gICAgYWNjZXNzX3Rva2VuOiBhY2Nlc3NUb2tlbixcclxuICB9O1xyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IGdlbmVyYXRlU2lnbmF0dXJlKGVuZHBvaW50LCBwYXJhbXMpO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChgJHtsYXphZGFJZEFwaVVybH0ke2VuZHBvaW50fWAsIHtcclxuICAgICAgcGFyYW1zOiB7IC4uLnBhcmFtcywgc2lnbjogc2lnbmF0dXJlIH0sXHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgdGhyb3cgZXJyb3I7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QnJhbmQoXHJcbiAgYWNjZXNzVG9rZW46IHN0cmluZyxcclxuICBzdGFydFJvdzogc3RyaW5nLFxyXG4gIHBhZ2VTaXplOiBzdHJpbmdcclxuKTogUHJvbWlzZTxhbnk+IHtcclxuICBjb25zdCBlbmRwb2ludCA9IFwiL2NhdGVnb3J5L2JyYW5kcy9xdWVyeVwiO1xyXG4gIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgYXBwX2tleTogYXBwS2V5LFxyXG4gICAgc2lnbl9tZXRob2Q6IFwic2hhMjU2XCIsXHJcbiAgICB0aW1lc3RhbXAsXHJcbiAgICBzdGFydFJvdyxcclxuICAgIHBhZ2VTaXplLFxyXG4gICAgYWNjZXNzX3Rva2VuOiBhY2Nlc3NUb2tlbixcclxuICB9O1xyXG5cclxuICBjb25zdCBzaWduYXR1cmUgPSBnZW5lcmF0ZVNpZ25hdHVyZShlbmRwb2ludCwgcGFyYW1zKTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoYCR7bGF6YWRhSWRBcGlVcmx9JHtlbmRwb2ludH1gLCB7XHJcbiAgICAgIHBhcmFtczogeyAuLi5wYXJhbXMsIHNpZ246IHNpZ25hdHVyZSB9LFxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yOlwiLCBlcnJvci5tZXNzYWdlKTtcclxuICAgIHRocm93IGVycm9yO1xyXG4gIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UHJvZHVjdChcclxuICBhY2Nlc3NUb2tlbjogc3RyaW5nLFxyXG4gIGZpbHRlcjogc3RyaW5nLFxyXG4gIGxpbWl0OiBzdHJpbmcsXHJcbiAgc2t1X3NlbGxlcl9saXN0OiBzdHJpbmdcclxuKTogUHJvbWlzZTxhbnk+IHtcclxuICBjb25zdCBlbmRwb2ludCA9IFwiL3Byb2R1Y3RzL2dldFwiO1xyXG4gIGNvbnN0IHRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgY29uc3QgcGFyYW1zID0ge1xyXG4gICAgYXBwX2tleTogYXBwS2V5LFxyXG4gICAgc2lnbl9tZXRob2Q6IFwic2hhMjU2XCIsXHJcbiAgICB0aW1lc3RhbXAsXHJcbiAgICBhY2Nlc3NfdG9rZW46IGFjY2Vzc1Rva2VuLFxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IGdlbmVyYXRlU2lnbmF0dXJlKGVuZHBvaW50LCBwYXJhbXMpO1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChgJHtsYXphZGFJZEFwaVVybH0ke2VuZHBvaW50fWAsIHtcclxuICAgICAgcGFyYW1zOiB7IC4uLnBhcmFtcywgc2lnbjogc2lnbmF0dXJlIH0sXHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgdGhyb3cgZXJyb3I7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcclxuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gXCJjcnlwdG9cIjtcclxuaW1wb3J0IHsgYXBwS2V5LCBzZWNyZXRLZXksIGxhemFkYUFwaVVybCwgbGF6YWRhSWRBcGlVcmwgfSBmcm9tIFwiLlwiO1xyXG5cclxuY29uc3QgZ2VuZXJhdGVUb2tlblVybCA9IFwiaHR0cHM6Ly9hdXRoLmxhemFkYS5jb20vcmVzdC9hdXRoL3Rva2VuL2NyZWF0ZVwiO1xyXG5jb25zdCByZWZyZXNoVG9rZW5VcmwgPSBcImh0dHBzOi8vYXV0aC5sYXphZGEuY29tL3Jlc3QvYXV0aC90b2tlbi9yZWZyZXNoXCI7XHJcblxyXG4vKipcclxuICogR2VuZXJhdGUgTGF6YWRhIEFQSSBzaWduYXR1cmUgdXNpbmcgSE1BQy1TSEEyNTYuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBBUEkgZW5kcG9pbnQgVVJMLlxyXG4gKiBAcGFyYW0ge1JlY29yZDxzdHJpbmcsIHN0cmluZz59IHBhcmFtcyAtIEFQSSBwYXJhbWV0ZXJzLlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAtIFRoZSBnZW5lcmF0ZWQgc2lnbmF0dXJlLlxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVNpZ25hdHVyZShlbmRwb2ludCwgcGFyYW1zKSB7XHJcbiAgLy8gU29ydCBwYXJhbWV0ZXJzIGFscGhhYmV0aWNhbGx5XHJcbiAgY29uc3Qgc29ydGVkUGFyYW1zID0gT2JqZWN0LmtleXMocGFyYW1zKVxyXG4gICAgLnNvcnQoKVxyXG4gICAgLm1hcCgoa2V5KSA9PiBgJHtrZXl9JHtwYXJhbXNba2V5XX1gKVxyXG4gICAgLmpvaW4oXCJcIik7XHJcbiAgLy8gQ29uY2F0ZW5hdGUgdGhlIG1ldGhvZCwgZW5kcG9pbnQsIGFuZCBzb3J0ZWQgcGFyYW1ldGVyc1xyXG4gIGNvbnN0IHRvU2lnbiA9IGAke2VuZHBvaW50fSR7c29ydGVkUGFyYW1zfWA7XHJcbiAgY29uc29sZS5sb2codG9TaWduKTtcclxuICAvLyBDcmVhdGUgdGhlIEhNQUMtU0hBMjU2IGhhc2ggdXNpbmcgdGhlIEFQSSBzZWNyZXRcclxuICBjb25zdCBzaWduYXR1cmUgPSBjcnlwdG9cclxuICAgIC5jcmVhdGVIbWFjKFwic2hhMjU2XCIsIHNlY3JldEtleSlcclxuICAgIC51cGRhdGUodG9TaWduKVxyXG4gICAgLmRpZ2VzdChcImhleFwiKTtcclxuXHJcbiAgcmV0dXJuIHNpZ25hdHVyZS50b1VwcGVyQ2FzZSgpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVBY2Nlc3NUb2tlbihnZW5lcmF0ZVRva2VuUGFyYW1zOiB7XHJcbiAgY29kZTogc3RyaW5nO1xyXG4gIGFwcF9rZXk6IHN0cmluZztcclxuICB0aW1lc3RhbXA6IG51bWJlcjtcclxuICBzaWduX21ldGhvZDogc3RyaW5nO1xyXG59KSB7XHJcbiAgY29uc3Qgc2lnbmF0dXJlID0gZ2VuZXJhdGVTaWduYXR1cmUoXHJcbiAgICBcIi9hdXRoL3Rva2VuL2NyZWF0ZVwiLFxyXG4gICAgZ2VuZXJhdGVUb2tlblBhcmFtc1xyXG4gICk7XHJcblxyXG4gIHJldHVybiBhd2FpdCBheGlvcy5wb3N0KFxyXG4gICAgZ2VuZXJhdGVUb2tlblVybCxcclxuICAgIHsgLi4uZ2VuZXJhdGVUb2tlblBhcmFtcywgc2lnbjogc2lnbmF0dXJlIH0sXHJcbiAgICB7XHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVJlZnJlc2hUb2tlbihnZW5lcmF0ZVRva2VuUGFyYW1zOiB7XHJcbiAgY29kZTogc3RyaW5nO1xyXG4gIGFwcF9rZXk6IHN0cmluZztcclxuICB0aW1lc3RhbXA6IG51bWJlcjtcclxuICBzaWduX21ldGhvZDogc3RyaW5nO1xyXG4gIHJlZnJlc2hfdG9rZW46IHN0cmluZztcclxufSkge1xyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IGdlbmVyYXRlU2lnbmF0dXJlKFxyXG4gICAgXCIvYXV0aC90b2tlbi9yZWZyZXNoXCIsXHJcbiAgICBnZW5lcmF0ZVRva2VuUGFyYW1zXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIGF3YWl0IGF4aW9zLnBvc3QoXHJcbiAgICByZWZyZXNoVG9rZW5VcmwsXHJcbiAgICB7IC4uLmdlbmVyYXRlVG9rZW5QYXJhbXMsIHNpZ246IHNpZ25hdHVyZSB9LFxyXG4gICAge1xyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcclxuICAgICAgfSxcclxuICAgIH1cclxuICApO1xyXG59XHJcbiIsImltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcclxuaW1wb3J0IHsgYXBwS2V5LCBsYXphZGFJZEFwaVVybCB9IGZyb20gXCIuXCI7XHJcbmltcG9ydCB7IGdlbmVyYXRlU2lnbmF0dXJlIH0gZnJvbSBcIi4vc3lzdGVtTWFuYWdlbWVudFwiO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlbGxlcihhY2Nlc3NUb2tlbjogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcclxuICBjb25zdCBlbmRwb2ludCA9IFwiL3NlbGxlci9nZXRcIjtcclxuICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xyXG4gIGNvbnN0IHBhcmFtcyA9IHtcclxuICAgIGFwcF9rZXk6IGFwcEtleSxcclxuICAgIHNpZ25fbWV0aG9kOiBcInNoYTI1NlwiLFxyXG4gICAgdGltZXN0YW1wLFxyXG4gICAgYWNjZXNzX3Rva2VuOiBhY2Nlc3NUb2tlbixcclxuICB9O1xyXG5cclxuICBjb25zdCBzaWduYXR1cmUgPSBnZW5lcmF0ZVNpZ25hdHVyZShlbmRwb2ludCwgcGFyYW1zKTtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5nZXQoYCR7bGF6YWRhSWRBcGlVcmx9JHtlbmRwb2ludH1gLCB7XHJcbiAgICAgIHBhcmFtczogeyAuLi5wYXJhbXMsIHNpZ246IHNpZ25hdHVyZSB9LFxyXG4gICAgfSk7XHJcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcclxuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgdGhyb3cgZXJyb3I7XHJcbiAgfVxyXG59XHJcbiJdfQ==