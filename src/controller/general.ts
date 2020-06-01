import HttpStatus from "http-status-codes";
import { BaseContext } from "koa";
import { description, request, summary, tagsAll } from "koa-swagger-decorator";

import pkgJson = require("../../package.json");

const appName: string = pkgJson.name;
const appVersion: string = pkgJson.version;
@tagsAll(["General"])
export default class GeneralController {
  @request("get", "/")
  @summary("Welcome page")
  @description("A simple welcome message to verify the service is up and running.")
  public static async main(ctx: BaseContext): Promise<void> {
    ctx.body = {
      App: appName,
      Version: appVersion,
    };
  }

  @request("get", "/api/health")
  @summary("API Health")
  @description("Health is used to indicate if the API is up or down.")
  public static async health(ctx: BaseContext) {
    ctx.body = {
      app: appName,
      status: HttpStatus.OK,
      version: appVersion,
    };
  }
}
