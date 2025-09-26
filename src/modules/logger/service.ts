import pino from 'pino';
import { Logger } from './types';

export class LoggerService {
    constructor(private logFilePath: string) {}

    getLogger(): Logger {
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