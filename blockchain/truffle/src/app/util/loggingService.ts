import moment from "moment";
import {BehaviorSubject} from "rxjs";

const DATE_TIME_FORMAT = 'YY/MM/DD HH:mm:ss:ms';

export class LoggingService {
  private logs: BehaviorSubject<string>;
  private loggingOn: boolean;

  constructor() {
    this.logs = new BehaviorSubject<string>('');
    this.loggingOn = true;
  }

  setLoggingOn(loggingOn) {
    this.loggingOn = loggingOn;
  }

  getLogsSubject() {
    return this.logs;
  }

  logInfo(value: string) {
    if (this.loggingOn)
      this.logs.next("[" + this.getTimestamp() + "]: " + value);
  }

  private getTimestamp() {
    return (moment(new Date())).format(DATE_TIME_FORMAT)
  }
}
