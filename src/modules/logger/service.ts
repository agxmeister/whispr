import pino from 'pino';
import { Logger, LoggerFactory as LoggerFactoryInterface } from './types';

export class LoggerFactory implements LoggerFactoryInterface {
    constructor(private logFilePath: string) {}

    create(): Logger {
        return pino({
            level: 'info',
            base: null,
            transport: {
                target: 'pino/file',
                options: {
                    destination: this.logFilePath,
                    mkdir: true
                }
            }
        });
    }
}