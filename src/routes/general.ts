import Router from "koa-router";
import controller from "../controller";

const router: Router = new Router();

router.get("/", controller.general.main);
router.get("/api", controller.general.main);
router.get("/api/health", controller.general.health);

export default router.routes();
