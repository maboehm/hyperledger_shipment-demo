import { AppConfig } from './../../app/app.config';

export class Logger {
  public static log(msg: any) {
    if (AppConfig.DEVELOPMENT) {
      console.log(msg);
    }
  }
  public static error(msg: any) {
    console.error(msg);
  }
  public static warn(msg: any) {
    console.warn(msg);
  }

}
