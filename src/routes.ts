// import Router from "koa-router";
import { SwaggerRouter } from "koa-swagger-decorator";

// import { unprotectedRouter } from "./unprotectedRoutes";
// import { protectedRouter } from "./protectedRoutes";

import generalRouter from "./routes/general";

const router = new SwaggerRouter();

// Swagger endpoint
router.swagger({
  title: "safiriPay-api",
  description: "SafiriPay REST API",
  version: "1.5.0",
});

// mapDir will scan the input dir, and automatically call router.map to all Router Class
router.mapDir(__dirname);

// GENERAL ROUTES
router.get("/", generalRouter);

export { router };
