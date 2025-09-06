export interface AcknowledgmentToken {
    code: string;
    edge: string;
    endpoint: {
        method: string;
        path: string;
    };
    created: string;
}
