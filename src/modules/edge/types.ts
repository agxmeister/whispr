export type Specification = {
    url?: string,
    path?: string,
}

export type Edge = {
    name: string,
    description?: string,
    tasks: string[],
    api: {
        specification: Specification,
        request: {
            url: string,
            headers: Record<string, string>,
        },
    },
    environment?: {
        name: string,
        description: string,
        sensitive?: boolean,
    }[],
}
