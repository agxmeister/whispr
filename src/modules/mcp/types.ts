export interface Tool {
    getName(): string;
    getDescription(): string;
    getSchema(): any;
    getHandler(): (...args: any[]) => Promise<any>;
}