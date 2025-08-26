export interface Tool {
    readonly name: string;
    readonly description: string;
    readonly schema: any;
    readonly handler: (...args: any[]) => Promise<any>;
}