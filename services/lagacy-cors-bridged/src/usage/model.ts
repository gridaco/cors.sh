import * as dynamoose from "dynamoose";
import { nanoid } from "nanoid";

export type AppId = string | "anonymous" | "official-demo";

export interface CorsProxyApiRequest {
  /**
   * ip address of request client (could be server / app / web)
   */
  ip?: string;
  /**
   * compressed / raw user agent data of the request
   */
  ua?: string;

  /**
   * request origin from request headers
   */
  origin?: string;

  /**
   * target resource url
   */
  target: string;
  /**
   * duration in ms
   */
  duration: number;
  /**
   * data payload
   */
  size: number;

  /**
   * request timestamp
   */
  at: Date;

  /**
   * the user/requester app
   */
  app: AppId;
}

export interface CorsProxyApiRequestLog extends CorsProxyApiRequest {
  /**
   * unique id of the request
   */
  id: string;

  /**
   * billing duration in ms - ceils with 100ms
   */
  billed_duration: number;
}

export const CorsRequestLogSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      required: true,
      default: () => nanoid(),
    },
    app: {
      type: String,
      required: true,
      index: {
        name: "appIndex",
      },
    },
    ua: {
      type: String,
      required: false,
    },
    at: {
      type: Date,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    ip: {
      type: String,
      required: false,
    },
    target: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    billed_duration: {
      type: Number,
      required: true,
    },
  },
  {
    saveUnknown: true,
  }
);

const CORS_REQUEST_LOG_TABLE_NAME = process.env
  .DYNAMODB_TABLE_USAGE_LOG as string;

export const CorsRequestLogModel = dynamoose.model(
  CORS_REQUEST_LOG_TABLE_NAME,
  CorsRequestLogSchema,
  {
    create: true,
  }
);
