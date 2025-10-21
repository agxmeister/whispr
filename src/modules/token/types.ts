export interface Token<T = unknown> {
    code: string;
    scope: string;
    payload: T;
    created: string;
}
