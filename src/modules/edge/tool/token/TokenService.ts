import {injectable, inject} from "inversify";
import { AcknowledgmentToken } from "./types";
import { AcknowledgmentTokenRepository } from "./TokenRepository";
import { Edge } from "@/modules/edge";
import { OpenApiEndpointRoute } from "../types";
import {dependencies} from "@/dependencies";

@injectable()
export class AcknowledgmentTokenService {
    constructor(@inject(dependencies.AcknowledgmentTokenRepository) private readonly repository: AcknowledgmentTokenRepository) {
    }

    getAcknowledgmentToken(edge: Edge, endpoint: OpenApiEndpointRoute): AcknowledgmentToken | null {
        return this.repository.find(edge, endpoint);
    }

    setAcknowledgmentToken(edge: Edge, endpoint: OpenApiEndpointRoute): AcknowledgmentToken {
        const token = this.repository.find(edge, endpoint);
        if (token) {
            return token;
        }
        return this.repository.add(edge, endpoint);
    }
}