import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export type IDbConnectionType = "LOCAL" | "REMOTE";

export interface IConfig {
  PORT: number;
  DEBUG_LOGGING: boolean;
  JWT_SECRET: string;
  APP_SECRET: string;
  DB_URL: string;
  DB_NAME: string;
  DB_MODE: IDbConnectionType;
  DB_ENTITIES_PATH: string[];
  DB_SSL_CONNECTION: boolean;
  CRON_JOB_EXPRESSION: string;
  AGENDA_CONFIG: {
    db: {
      address: string;
      collection: string;
    };
  };
  SUPPORT_PASSWORD: string;
  SMTP_USER_EMAIL: string;
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
}

const DB_MODE: IDbConnectionType = (process.env.DB_MODE as IDbConnectionType) || "LOCAL";
const REMOTE_DB_URL = process.env.REMOTE_DB_URL || "";
const LOCAL_DB_URL = process.env.LOCAL_DB_URL || "";
const isDevMode = process.env.NODE_ENV != "production";

const config: IConfig = {
  DB_MODE,
  DB_NAME: process.env.DB_NAME || "safiriPay",
  APP_SECRET: process.env.APP_SECRET || "safiriPay-secret",
  PORT: process.env.PORT ? +process.env.PORT : 3000,
  DEBUG_LOGGING: !!process.env.DEBUG_LOGGING || isDevMode,
  DB_SSL_CONNECTION: !isDevMode,
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-whatever",
  DB_URL: DB_MODE === "LOCAL" ? LOCAL_DB_URL : REMOTE_DB_URL,
  DB_ENTITIES_PATH: [...(isDevMode ? ["src/entity/**/*.ts"] : ["dist/src/entity/**/*.js"])],
  CRON_JOB_EXPRESSION: "0 * * * *",
  AGENDA_CONFIG: {
    db: {
      address: DB_MODE === "LOCAL" ? LOCAL_DB_URL : REMOTE_DB_URL,
      collection: "agenda",
    },
  },
  SUPPORT_PASSWORD: process.env.SUPPORT_PASSWORD || "",
  SMTP_USER_EMAIL: process.env.SMTP_USER_EMAIL || "",
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || "",
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || "",
};

console.debug(config);

export { config };
