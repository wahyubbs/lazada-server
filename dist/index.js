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
        PrimaryCategory: "10100794",
        Images: {
          Image: [
            "https://sg-test-11.slatic.net/p/df43a20901802b1c223382951138719f.jpg"
          ]
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
          preorder_days: "25"
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
                  "https://sg-test-11.slatic.net/p/df43a20901802b1c223382951138719f.jpg"
                ]
              }
            }
          ]
        }
      }
    }
  };
  console.log(product);
  const queryParams = { ...commonParams };
  const signature = generateSignature(endpoint, queryParams);
  console.log(signature);
  try {
    const response = await _axios2.default.post(`${lazadaIdApiUrl2}${endpoint}`, product, {
      params: { ...commonParams, sign: signature }
    });
    console.log("Product Created:", response.data);
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
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
app.use(_express2.default.json());
var port = 3e3;
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
app.post("/product/create", async (req, res) => {
  const accessToken = req.body.access_token;
  const form = JSON.parse(req.body.form);
  form.Images = JSON.parse(form.Images);
  form.Attributes = JSON.parse(form.Attributes);
  form.Skus = { sku: JSON.parse(form.Skus.sku) };
  try {
    const product = await createProduct(form, accessToken);
    console.log("product", product);
    res.send("create product successful!");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});






exports.appKey = appKey2; exports.lazadaApiUrl = lazadaApiUrl3; exports.lazadaIdApiUrl = lazadaIdApiUrl2; exports.redirectUri = redirectUri; exports.secretKey = secretKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2luZGV4LnRzIiwiLi4vcHJvZHVjdE1hbmFnZW1lbnQudHMiLCIuLi9zeXN0ZW1NYW5hZ2VtZW50LnRzIl0sIm5hbWVzIjpbImF4aW9zIiwiYXBwS2V5IiwibGF6YWRhSWRBcGlVcmwiLCJsYXphZGFBcGlVcmwiXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLGFBQWE7QUFDcEIsT0FBTyxVQUFVOzs7QUNEakIsT0FBT0EsWUFBVzs7O0FDQWxCLE9BQU8sV0FBVztBQUNsQixZQUFZLFlBQVk7QUFHeEIsSUFBTSxtQkFBbUI7QUFDekIsSUFBTSxrQkFBa0I7QUFTakIsU0FBUyxrQkFBa0IsVUFBVSxRQUFRO0FBRWxELFFBQU0sZUFBZSxPQUFPLEtBQUssTUFBTSxFQUNwQyxLQUFLLEVBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxFQUNuQyxLQUFLLEVBQUU7QUFFVixRQUFNLFNBQVMsR0FBRyxRQUFRLEdBQUcsWUFBWTtBQUN6QyxVQUFRLElBQUksTUFBTTtBQUVsQixRQUFNLFlBQ0gsa0JBQVcsVUFBVSxTQUFTLEVBQzlCLE9BQU8sTUFBTSxFQUNiLE9BQU8sS0FBSztBQUVmLFNBQU8sVUFBVSxZQUFZO0FBQy9CO0FBRUEsZUFBc0Isb0JBQW9CLHFCQUt2QztBQUNELFFBQU0sWUFBWTtBQUFBLElBQ2hCO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFFQSxTQUFPLE1BQU0sTUFBTTtBQUFBLElBQ2pCO0FBQUEsSUFDQSxFQUFFLEdBQUcscUJBQXFCLE1BQU0sVUFBVTtBQUFBLElBQzFDO0FBQUEsTUFDRSxTQUFTO0FBQUEsUUFDUCxnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxlQUFzQixxQkFBcUIscUJBTXhDO0FBQ0QsUUFBTSxZQUFZO0FBQUEsSUFDaEI7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUVBLFNBQU8sTUFBTSxNQUFNO0FBQUEsSUFDakI7QUFBQSxJQUNBLEVB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QixRQUFJLEtBQUssNEJBQTRCO0FBQUEsRUFDdkMsU0FBUyxPQUFPO0FBQ2QsWUFBUSxNQUFNLFVBQVUsTUFBTSxPQUFPO0FBQ3JDLFFBQUksT0FBTyxHQUFHLEVBQUUsS0FBSyx1QkFBdUI7QUFBQSxFQUM5QztBQUNGLENBQUM7QUFFRCxJQUFJLE9BQU8sTUFBTSxNQUFNO0FBQ3JCLFVBQVEsSUFBSSx5Q0FBeUMsSUFBSSxFQUFFO0FBQzdELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IGNvcnMgZnJvbSBcImNvcnNcIjtcblxuaW1wb3J0IHsgY3JlYXRlUHJvZHVjdCwgZ2V0U2VsbGVyIH0gZnJvbSBcIi4vcHJvZHVjdE1hbmFnZW1lbnRcIjtcbmltcG9ydCB7IGdlbmVyYXRlQWNjZXNzVG9rZW4sIGdlbmVyYXRlUmVmcmVzaFRva2VuIH0gZnJvbSBcIi4vc3lzdGVtTWFuYWdlbWVudFwiO1xuXG5jb25zdCBhcHAgPSBleHByZXNzKCk7XG5hcHAudXNlKGNvcnMoKSk7XG5hcHAub3B0aW9ucyhcIipcIiwgY29ycygpKTtcbmFwcC51c2UoZXhwcmVzcy5qc29uKCkpO1xuXG5jb25zdCBwb3J0ID0gMzAwMDtcbmV4cG9ydCBjb25zdCBhcHBLZXkgPSBcIjEyNzM2MVwiO1xuZXhwb3J0IGNvbnN0IHNlY3JldEtleSA9IFwiVVBxWEliZ1g0M0FWRmpYWjhybldITVBVYnpPYlVYMFdcIjtcbmV4cG9ydCBjb25zdCBsYXphZGFBcGlVcmwgPSBcImh0dHBzOi8vYXBpLmxhemFkYS5jb20vcmVzdFwiO1xuZXhwb3J0IGNvbnN0IGxhemFkYUlkQXBpVXJsID0gXCJodHRwczovL2FwaS5sYXphZGEuY28uaWQvcmVzdFwiO1xuZXhwb3J0IGNvbnN0IHJlZGlyZWN0VXJpID0gXCJodHRwczovL2RwZ2hxcTEyLTUxNzMuYXNzZS5kZXZ0dW5uZWxzLm1zL2NhbGxiYWNrXCI7XG5cbmFwcC5nZXQoXCIvYXV0aFwiLCAoXywgcmVzKSA9PiB7XG4gIGNvbnN0IGF1dGhvcml6YXRpb25VcmwgPSBgaHR0cHM6Ly9hdXRoLmxhemFkYS5jb20vb2F1dGgvYXV0aG9yaXplP3Jlc3BvbnNlX3R5cGU9Y29kZSZmb3JjZV9hdXRoPXRydWUmcmVkaXJlY3RfdXJpPSR7cmVkaXJlY3RVcml9JmNsaWVudF9pZD0ke2FwcEtleX0mYXBwX2tleT0ke2FwcEtleX1gO1xuICByZXMucmVkaXJlY3QoYXV0aG9yaXphdGlvblVybCk7XG59KTtcblxuYXBwLmdldChcIi90b2tlbi9jcmVhdGVcIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gIGNvbnN0IGF1dGhvcml6YXRpb25Db2RlID0gcmVxLnF1ZXJ5LmNvZGUgYXMgc3RyaW5nO1xuXG4gIGNvbnN0IGdlbmVyYXRlVG9rZW5QYXJhbXMgPSB7XG4gICAgY29kZTogYXV0aG9yaXphdGlvbkNvZGUsXG4gICAgYXBwX2tleTogYXBwS2V5LFxuICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICBzaWduX21ldGhvZDogXCJzaGEyNTZcIixcbiAgfTtcblxuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlVG9rZW4gPSBhd2FpdCBnZW5lcmF0ZUFjY2Vzc1Rva2VuKGdlbmVyYXRlVG9rZW5QYXJhbXMpO1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gcmVzcG9uc2VUb2tlbi5kYXRhLmFjY2Vzc190b2tlbjtcbiAgICBjb25zdCByZWZyZXNoX3Rva2VuID0gcmVzcG9uc2VUb2tlbi5kYXRhLnJlZnJlc2hfdG9rZW47XG4gICAgY29uc3QgZXhwaXJlc19pbiA9IHJlc3BvbnNlVG9rZW4uZGF0YS5leHBpcmVzX2luO1xuXG4gICAgaWYgKGFjY2Vzc1Rva2VuICYmIHJlZnJlc2hfdG9rZW4pXG4gICAgICByZXMuc2VuZCh7XG4gICAgICAgIHRva2VuOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaF90b2tlbixcbiAgICAgICAgZXhwaXJlZDogZXhwaXJlc19pbixcbiAgICAgICAgbG9naW5fZGF0ZTogbmV3IERhdGUoKSxcbiAgICAgIH0pO1xuICAgIGVsc2UgcmVzLnN0YXR1cyg0MDApLnNlbmQoXCJnZW5lcmF0ZSBhY2Nlc3MgdG9rZW4gZmFpbFwiKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yLm1lc3NhZ2UpO1xuICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKFwiSW50ZXJuYWwgU2VydmVyIEVycm9yXCIpO1xuICB9XG59KTtcbmFwcC5nZXQoXCIvdG9rZW4vcmVmcmVzaFwiLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgY29uc3QgYXV0aG9yaXphdGlvbkNvZGUgPSByZXEucXVlcnkuY29kZSBhcyBzdHJpbmc7XG4gIGNvbnN0IHJlZnJlc2hUb2tlbiA9IHJlcS5xdWVyeS5yZWZyZXNoVG9rZW4gYXMgc3RyaW5nO1xuXG4gIGNvbnN0IGdlbmVyYXRlVG9rZW5QYXJhbXMgPSB7XG4gICAgY29kZTogYXV0aG9yaXphdGlvbkNvZGUsXG4gICAgcmVmcmVzaF90b2tlbjogcmVmcmVzaFRva2VuLFxuICAgIGFwcF9rZXk6IGFwcEtleSxcbiAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgc2lnbl9tZXRob2Q6IFwic2hhMjU2XCIsXG4gIH07XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZVRva2VuID0gYXdhaXQgZ2VuZXJhdGVSZWZyZXNoVG9rZW4oZ2VuZXJhdGVUb2tlblBhcmFtcyk7XG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSByZXNwb25zZVRva2VuLmRhdGEuYWNjZXNzX3Rva2VuO1xuICAgIHJlcy5zZW5kKGFjY2Vzc1Rva2VuKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yLm1lc3NhZ2UpO1xuICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKFwiSW50ZXJuYWwgU2VydmVyIEVycm9yXCIpO1xuICB9XG59KTtcbmFwcC5wb3N0KFwiL3NlbGxlci9pbmZvXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlcS5ib2R5LmFjY2Vzc190b2tlbjtcbiAgdHJ5IHtcbiAgICBsZXQgZGF0YVNlbGxlciA9IGF3YWl0IGdldFNlbGxlcihhY2Nlc3NUb2tlbik7XG4gICAgcmVzLnNlbmQoZGF0YVNlbGxlcik7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yOlwiLCBlcnJvci5tZXNzYWdlKTtcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChcIkludGVybmFsIFNlcnZlciBFcnJvclwiKTtcbiAgfVxufSk7XG5cbmFwcC5wb3N0KFwiL3Byb2R1Y3QvY3JlYXRlXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlcS5ib2R5LmFjY2Vzc190b2tlbjtcbiAgY29uc3QgZm9ybSA9IEpTT04ucGFyc2UocmVxLmJvZHkuZm9ybSk7XG4gIGZvcm0uSW1hZ2VzID0gSlNPTi5wYXJzZShmb3JtLkltYWdlcyk7XG4gIGZvcm0uQXR0cmlidXRlcyA9IEpTT04ucGFyc2UoZm9ybS5BdHRyaWJ1dGVzKTtcbiAgZm9ybS5Ta3VzID0geyBza3U6IEpTT04ucGFyc2UoZm9ybS5Ta3VzLnNrdSkgfTtcblxuICB0cnkge1xuICAgIGNvbnN0IHByb2R1Y3QgPSBhd2FpdCBjcmVhdGVQcm9kdWN0KGZvcm0sIGFjY2Vzc1Rva2VuKTtcbiAgICBjb25zb2xlLmxvZyhcInByb2R1Y3RcIiwgcHJvZHVjdCk7XG4gICAgcmVzLnNlbmQoXCJjcmVhdGUgcHJvZHVjdCBzdWNjZXNzZnVsIVwiKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3I6XCIsIGVycm9yLm1lc3NhZ2UpO1xuICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKFwiSW50ZXJuYWwgU2VydmVyIEVycm9yXCIpO1xuICB9XG59KTtcblxuYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7XG4gIGNvbnNvbGUubG9nKGBTZXJ2ZXIgaXMgcnVubmluZyBhdCBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH1gKTtcbn0pO1xuIiwiaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IHsgYXBwS2V5LCBzZWNyZXRLZXksIGxhemFkYUFwaVVybCwgbGF6YWRhSWRBcGlVcmwgfSBmcm9tIFwiLlwiO1xuaW1wb3J0IHsgZ2VuZXJhdGVTaWduYXR1cmUgfSBmcm9tIFwiLi9zeXN0ZW1NYW5hZ2VtZW50XCI7XG4vKipcbiAqIENyZWF0ZSBhIHByb2R1Y3Qgb24gTGF6YWRhLlxuICogQHBhcmFtIHtzdHJpbmd9IHByb2R1Y3ROYW1lIC0gTmFtZSBvZiB0aGUgcHJvZHVjdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBwcmljZSAtIFByaWNlIG9mIHRoZSBwcm9kdWN0LlxuICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uIC0gRGVzY3JpcHRpb24gb2YgdGhlIHByb2R1Y3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2VVcmwgLSBVUkwgb2YgdGhlIHByb2R1Y3QgaW1hZ2UuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx2b2lkPn0gLSBBIHByb21pc2UgaW5kaWNhdGluZyB0aGUgc3VjY2VzcyBvZiB0aGUgb3BlcmF0aW9uLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUHJvZHVjdChcbiAgZm9ybTogYW55LFxuICBhY2Nlc3NUb2tlbjogc3RyaW5nXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgZW5kcG9pbnQgPSBcIi9wcm9kdWN0L2NyZWF0ZVwiO1xuICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuXG4gIGNvbnN0IGNvbW1vblBhcmFtcyA9IHtcbiAgICBhcHBfa2V5OiBhcHBLZXksXG4gICAgc2lnbl9tZXRob2Q6IFwic2hhMjU2XCIsXG4gICAgdGltZXN0YW1wLFxuICAgIGFjY2Vzc190b2tlbjogYWNjZXNzVG9rZW4sXG4gIH07XG5cbiAgY29uc3QgcHJvZHVjdCA9IHtcbiAgICBSZXF1ZXN0OiB7XG4gICAgICBQcm9kdWN0OiB7XG4gICAgICAgIFByaW1hcnlDYXRlZ29yeTogXCIxMDEwMDc5NFwiLFxuICAgICAgICBJbWFnZXM6IHtcbiAgICAgICAgICBJbWFnZTogW1xuICAgICAgICAgICAgXCJodHRwczovL3NnLXRlc3QtMTEuc2xhdGljLm5ldC9wL2RmNDNhMjA5MDE4MDJiMWMyMjMzODI5NTExMzg3MTlmLmpwZ1wiLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBuYW1lOiBcImJhanUgYmJzXCIsXG4gICAgICAgICAgZGVzY3JpcHRpb246IFwiVEVTVFwiLFxuICAgICAgICAgIGJyYW5kOiBcIk5vIEJyYW5kXCIsXG4gICAgICAgICAgbW9kZWw6IFwidGVzdFwiLFxuICAgICAgICAgIHdhdGVycHJvb2Y6IFwiV2F0ZXJwcm9vZlwiLFxuICAgICAgICAgIHdhcnJhbnR5OiBcIjEgTW9udGhcIixcbiAgICAgICAgICBzaG9ydF9kZXNjcmlwdGlvbjogXCJjbSB4IDFlZmd0ZWNtPGJyIC8+PGJyZndlZmd0ZWtcIixcbiAgICAgICAgICBIYXptYXQ6IFwiTm9uZVwiLFxuICAgICAgICAgIG1hdGVyaWFsOiBcIkxlYXRoZXJcIixcbiAgICAgICAgICBsYXB0b3Bfc2l6ZTogXCIxMSAtIDEyIGluY2hlc1wiLFxuICAgICAgICAgIGRlbGl2ZXJ5X29wdGlvbl9zb2Y6IFwiTm9cIixcbiAgICAgICAgICBuYW1lX2VuZ3JhdmVtZW50OiBcIlllc1wiLFxuICAgICAgICAgIGdpZnRfd3JhcHBpbmc6IFwiWWVzXCIsXG4gICAgICAgICAgcHJlb3JkZXJfZW5hYmxlOiBcIlllc1wiLFxuICAgICAgICAgIHByZW9yZGVyX2RheXM6IFwiMjVcIixcbiAgICAgICAgfSxcbiAgICAgICAgU2t1czoge1xuICAgICAgICAgIFNrdTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBTZWxsZXJTa3U6IFwidGVzdDIwMjIgMDJcIixcbiAgICAgICAgICAgICAgcXVhbnRpdHk6IFwiM1wiLFxuICAgICAgICAgICAgICBwcmljZTogXCI0MDAwMFwiLFxuICAgICAgICAgICAgICBzcGVjaWFsX3ByaWNlOiBcIjMwMDAwXCIsXG4gICAgICAgICAgICAgIHNwZWNpYWxfZnJvbV9kYXRlOiBcIjIwMjItMDYtMjAgMTc6MTg6MzFcIixcbiAgICAgICAgICAgICAgc3BlY2lhbF90b19kYXRlOiBcIjIwMjUtMDMtMTUgMTc6MTg6MzFcIixcbiAgICAgICAgICAgICAgcGFja2FnZV9oZWlnaHQ6IFwiMTBcIixcbiAgICAgICAgICAgICAgcGFja2FnZV9sZW5ndGg6IFwiMTBcIixcbiAgICAgICAgICAgICAgcGFja2FnZV93aWR0aDogXCIxMFwiLFxuICAgICAgICAgICAgICBwYWNrYWdlX3dlaWdodDogXCIwLjVcIixcbiAgICAgICAgICAgICAgcGFja2FnZV9jb250ZW50OiBcImxhcHRvcCBiYWdcIixcbiAgICAgICAgICAgICAgSW1hZ2VzOiB7XG4gICAgICAgICAgICAgICAgSW1hZ2U6IFtcbiAgICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9zZy10ZXN0LTExLnNsYXRpYy5uZXQvcC9kZjQzYTIwOTAxODAyYjFjMjIzMzgyOTUxMTM4NzE5Zi5qcGdcIixcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xuICBjb25zb2xlLmxvZyhwcm9kdWN0KTtcbiAgY29uc3QgcXVlcnlQYXJhbXMgPSB7IC4uLmNvbW1vblBhcmFtcyB9O1xuICBjb25zdCBzaWduYXR1cmUgPSBnZW5lcmF0ZVNpZ25hdHVyZShlbmRwb2ludCwgcXVlcnlQYXJhbXMpO1xuICBjb25zb2xlLmxvZyhzaWduYXR1cmUpO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KGAke2xhemFkYUlkQXBpVXJsfSR7ZW5kcG9pbnR9YCwgcHJvZHVjdCwge1xuICAgICAgcGFyYW1zOiB7IC4uLmNvbW1vblBhcmFtcywgc2lnbjogc2lnbmF0dXJlIH0sXG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhcIlByb2R1Y3QgQ3JlYXRlZDpcIiwgcmVzcG9uc2UuZGF0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yOlwiLCBlcnJvci5tZXNzYWdlKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2VsbGVyKGFjY2Vzc1Rva2VuOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICBjb25zdCBlbmRwb2ludCA9IFwiL3NlbGxlci9nZXRcIjtcbiAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIGFwcF9rZXk6IGFwcEtleSxcbiAgICBzaWduX21ldGhvZDogXCJzaGEyNTZcIixcbiAgICB0aW1lc3RhbXAsXG4gICAgYWNjZXNzX3Rva2VuOiBhY2Nlc3NUb2tlbixcbiAgfTtcblxuICBjb25zdCBzaWduYXR1cmUgPSBnZW5lcmF0ZVNpZ25hdHVyZShlbmRwb2ludCwgcGFyYW1zKTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF4aW9zLmdldChgJHtsYXphZGFJZEFwaVVybH0ke2VuZHBvaW50fWAsIHtcbiAgICAgIHBhcmFtczogeyAuLi5wYXJhbXMsIHNpZ246IHNpZ25hdHVyZSB9LFxuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjpcIiwgZXJyb3IubWVzc2FnZSk7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cbiIsImltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcclxuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gXCJjcnlwdG9cIjtcclxuaW1wb3J0IHsgYXBwS2V5LCBzZWNyZXRLZXksIGxhemFkYUFwaVVybCwgbGF6YWRhSWRBcGlVcmwgfSBmcm9tIFwiLlwiO1xyXG5cclxuY29uc3QgZ2VuZXJhdGVUb2tlblVybCA9IFwiaHR0cHM6Ly9hdXRoLmxhemFkYS5jb20vcmVzdC9hdXRoL3Rva2VuL2NyZWF0ZVwiO1xyXG5jb25zdCByZWZyZXNoVG9rZW5VcmwgPSBcImh0dHBzOi8vYXV0aC5sYXphZGEuY29tL3Jlc3QvYXV0aC90b2tlbi9yZWZyZXNoXCI7XHJcblxyXG4vKipcclxuICogR2VuZXJhdGUgTGF6YWRhIEFQSSBzaWduYXR1cmUgdXNpbmcgSE1BQy1TSEEyNTYuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSBBUEkgZW5kcG9pbnQgVVJMLlxyXG4gKiBAcGFyYW0ge1JlY29yZDxzdHJpbmcsIHN0cmluZz59IHBhcmFtcyAtIEFQSSBwYXJhbWV0ZXJzLlxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAtIFRoZSBnZW5lcmF0ZWQgc2lnbmF0dXJlLlxyXG4gKi9cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVNpZ25hdHVyZShlbmRwb2ludCwgcGFyYW1zKSB7XHJcbiAgLy8gU29ydCBwYXJhbWV0ZXJzIGFscGhhYmV0aWNhbGx5XHJcbiAgY29uc3Qgc29ydGVkUGFyYW1zID0gT2JqZWN0LmtleXMocGFyYW1zKVxyXG4gICAgLnNvcnQoKVxyXG4gICAgLm1hcCgoa2V5KSA9PiBgJHtrZXl9JHtwYXJhbXNba2V5XX1gKVxyXG4gICAgLmpvaW4oXCJcIik7XHJcbiAgLy8gQ29uY2F0ZW5hdGUgdGhlIG1ldGhvZCwgZW5kcG9pbnQsIGFuZCBzb3J0ZWQgcGFyYW1ldGVyc1xyXG4gIGNvbnN0IHRvU2lnbiA9IGAke2VuZHBvaW50fSR7c29ydGVkUGFyYW1zfWA7XHJcbiAgY29uc29sZS5sb2codG9TaWduKTtcclxuICAvLyBDcmVhdGUgdGhlIEhNQUMtU0hBMjU2IGhhc2ggdXNpbmcgdGhlIEFQSSBzZWNyZXRcclxuICBjb25zdCBzaWduYXR1cmUgPSBjcnlwdG9cclxuICAgIC5jcmVhdGVIbWFjKFwic2hhMjU2XCIsIHNlY3JldEtleSlcclxuICAgIC51cGRhdGUodG9TaWduKVxyXG4gICAgLmRpZ2VzdChcImhleFwiKTtcclxuXHJcbiAgcmV0dXJuIHNpZ25hdHVyZS50b1VwcGVyQ2FzZSgpO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVBY2Nlc3NUb2tlbihnZW5lcmF0ZVRva2VuUGFyYW1zOiB7XHJcbiAgY29kZTogc3RyaW5nO1xyXG4gIGFwcF9rZXk6IHN0cmluZztcclxuICB0aW1lc3RhbXA6IG51bWJlcjtcclxuICBzaWduX21ldGhvZDogc3RyaW5nO1xyXG59KSB7XHJcbiAgY29uc3Qgc2lnbmF0dXJlID0gZ2VuZXJhdGVTaWduYXR1cmUoXHJcbiAgICBcIi9hdXRoL3Rva2VuL2NyZWF0ZVwiLFxyXG4gICAgZ2VuZXJhdGVUb2tlblBhcmFtc1xyXG4gICk7XHJcblxyXG4gIHJldHVybiBhd2FpdCBheGlvcy5wb3N0KFxyXG4gICAgZ2VuZXJhdGVUb2tlblVybCxcclxuICAgIHsgLi4uZ2VuZXJhdGVUb2tlblBhcmFtcywgc2lnbjogc2lnbmF0dXJlIH0sXHJcbiAgICB7XHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gICk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVJlZnJlc2hUb2tlbihnZW5lcmF0ZVRva2VuUGFyYW1zOiB7XHJcbiAgY29kZTogc3RyaW5nO1xyXG4gIGFwcF9rZXk6IHN0cmluZztcclxuICB0aW1lc3RhbXA6IG51bWJlcjtcclxuICBzaWduX21ldGhvZDogc3RyaW5nO1xyXG4gIHJlZnJlc2hfdG9rZW46IHN0cmluZztcclxufSkge1xyXG4gIGNvbnN0IHNpZ25hdHVyZSA9IGdlbmVyYXRlU2lnbmF0dXJlKFxyXG4gICAgXCIvYXV0aC90b2tlbi9yZWZyZXNoXCIsXHJcbiAgICBnZW5lcmF0ZVRva2VuUGFyYW1zXHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIGF3YWl0IGF4aW9zLnBvc3QoXHJcbiAgICByZWZyZXNoVG9rZW5VcmwsXHJcbiAgICB7IC4uLmdlbmVyYXRlVG9rZW5QYXJhbXMsIHNpZ246IHNpZ25hdHVyZSB9LFxyXG4gICAge1xyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcclxuICAgICAgfSxcclxuICAgIH1cclxuICApO1xyXG59XHJcbiJdfQ==