import {injectable, inject} from "inversify";
import { Token } from "./types";
import { TokenRepository } from "./TokenRepository";
import { Edge } from "@/modules/edge";
import { OpenApiEndpointRoute } from "@/modules/rest";
import {dependencies} from "@/dependencies";

@injectable()
export class TokenService {
    constructor(@inject(dependencies.TokenRepository) private readonly repository: TokenRepository) {
    }

    getToken(edge: Edge, endpoint: OpenApiEndpointRoute): Token | null {
        return this.repository.find(edge, endpoint);
    }

    setToken(edge: Edge, endpoint: OpenApiEndpointRoute): Token {
        const token = this.repository.find(edge, endpoint);
        if (token) {
            return token;
        }
        return this.repository.add(edge, endpoint);
    }
}
