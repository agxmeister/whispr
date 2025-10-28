export interface Tool {
    readonly name: string;
    readonly description: string;
    readonly schema: any;
    readonly handler: (input: any) => Promise<any>;
}
