export class AppConfig {
  public static get DEVELOPMENT(): boolean {
    return true;
  }
  public static get EVENT_URL(): string {
    return "ws://kit-blockchain.duckdns.org:31090/";
  }
  public static get REST_URL(): string {
    return "http://kit-blockchain.duckdns.org:31090/api/";
  }
}
