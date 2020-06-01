import Router from "@koa/router";
import controller from "./controller";

const unprotectedRouter = new Router();

// Hello World route
unprotectedRouter.get("/", controller.general.main);
unprotectedRouter.get("/api/health", controller.general.health);

export { unprotectedRouter };
