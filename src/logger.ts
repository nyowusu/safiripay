import Koa from "koa";
import winston, { format, createLogger } from "winston";

import { config } from "./config";

const loggerInstance = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
});

loggerInstance.configure({
  level: config.DEBUG_LOGGING ? "debug" : "info",
  transports: [
    // - Write all logs error (and below) to `error.log`.
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "log.log" }),
  ],
});

// if we're not in production then **ALSO** log to the `console`, with the colorized simple format
if (config.DEBUG_LOGGING) {
  loggerInstance.add(
    // -Write to all logs with specified level to console
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

export function logger() {
  return async (ctx: Koa.Context, next: () => Promise<any>) => {
    const start = new Date().getTime();

    await next();

    const ms = new Date().getTime() - start;

    let logLevel = "";

    if (ctx.status >= 500) logLevel = "error";
    else if (ctx.status >= 400) logLevel = "warn";
    else if (ctx.status >= 100) logLevel = "info";

    const msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

    loggerInstance.log(logLevel, msg);
  };
}

export default loggerInstance;
