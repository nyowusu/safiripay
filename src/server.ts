import Koa from "koa";
import jwt from "koa-jwt";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import compress from "koa-compress";
import cors from "@koa/cors";
import { createConnection } from "typeorm";
import "reflect-metadata";

// @ts-ignore
import session from "koa-session-store";

// @ts-ignore
import mongoStore from "koa-session-mongo";

import winston, { logger } from "./logger";
import { config } from "./config";

import { router } from "./routes";
// import { cron } from "./cron";

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
async function bootStrapServer() {
  try {
    const connection = await createConnection({
      type: "mongodb",
      url: config.DB_URL,
      synchronize: true,
      logging: true,
      database: config.DB_NAME,
      entities: config.DB_ENTITIES_PATH,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (!connection) throw new Error("Failed to connect to Mongo");

    const app = new Koa();

    app.keys = [config.APP_SECRET];

    // add middleware for session
    app.use(
      session({
        store: mongoStore.create({
          db: config.DB_NAME,
        }),
      })
    );
    // Provides important security headers to make your app more secure
    app.use(helmet());

    // Enable cors with default options
    app.use(cors());

    // Logger middleware -> use winston as logger (logging.ts with config)
    app.use(logger());

    // Enable compress with default options
    app.use(compress());

    // Enable bodyParser with default options
    app.use(bodyParser());

    // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(router.routes()).use(router.allowedMethods());

    // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
    // do not protect swagger-json and swagger-html endpoints
    app.use(jwt({ secret: config.JWT_SECRET }).unless({ path: [/^\/swagger-/] }));

    // // Register cron job to do any action needed
    // cron.start();

    app.listen(config.PORT);

    winston.info(`Server running on port ${config.PORT}`);
  } catch (error) {
    winston.error("TypeORM connection error: ", error);
  }
}

// START
bootStrapServer();
