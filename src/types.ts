export type Service = {
    name: string,
    url: {
        api: string,
        specification: string,
    },
    authorization: {
        key: string,
        value: string,
    },
    tool: {
        getApiEndpoints: string,
        getApiEndpointDetails: string,
        callApiEndpoint: string,
    },
}
