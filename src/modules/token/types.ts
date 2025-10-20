export interface Token {
    code: string;
    edge: string;
    endpoint: {
        method: string;
        path: string;
    };
    created: string;
}
