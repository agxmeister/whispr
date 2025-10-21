import {injectable, inject} from "inversify";
import { Token } from "./types";
import { TokenRepository } from "./TokenRepository";
import {dependencies} from "@/dependencies";

@injectable()
export class TokenService<T = unknown> {
    constructor(@inject(dependencies.TokenRepository) private readonly repository: TokenRepository<T>) {
    }

    getToken(scope: string, matcher: (payload: T) => boolean): Token<T> | null {
        return this.repository.find(scope, matcher);
    }

    setToken(scope: string, payload: T): Token<T> {
        return this.repository.add(scope, payload);
    }
}
