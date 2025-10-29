export type Result<T> = Success<T> | Failure<T>;

export type Success<T> = {
    readonly success: true;
    readonly value: T;
};

export type Failure<T> = {
    readonly success: false;
    readonly value: T;
};

export const success = <T>(value: T): Success<T> => ({
    success: true,
    value
});

export const failure = <T>(value: T): Failure<T> => ({
    success: false,
    value
});

export interface Tool {
    readonly name: string;
    readonly description: string;
    readonly schema: any;
    readonly handler: (input: any) => Promise<Result<any>>;
}
