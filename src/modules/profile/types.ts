export type Profile = {
    readonly: boolean;
    edge: {
        tools: string[];
    };
    metadata?: Record<string, any>;
};