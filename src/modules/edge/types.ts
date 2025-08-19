export type Edge = {
    name: string,
    description?: string,
    tasks: string[],
    api: {
        specification: string,
        request: {
            url: string,
            headers: Record<string, string>,
        },
    },
    environment: {
        name: string,
        description: string,
        sensitive?: boolean,
    }[],
}
