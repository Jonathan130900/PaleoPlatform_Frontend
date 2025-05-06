const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/uploads",
    createProxyMiddleware({
      target: "http://localhost:7224",
      changeOrigin: true,
      logLevel: "debug",
    })
  );
};
