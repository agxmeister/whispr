import { LogFn } from 'pino';

export interface Logger {
    info: LogFn;
    error: LogFn;
    warn: LogFn;
    debug: LogFn;
}