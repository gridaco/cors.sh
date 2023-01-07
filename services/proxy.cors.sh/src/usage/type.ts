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
  target?: string;
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
