export type TokenPayload = {
    method: string;
    path: string;
};

export type CallEndpointResult = {
    status: number;
    body: any;
};
