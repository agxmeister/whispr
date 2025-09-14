export class HttpError extends Error {
    constructor(
        public readonly status: number,
        public readonly body: any,
        message?: string
    ) {
        super(message || `HTTP ${status}`);
        this.name = 'HttpError';
    }
}