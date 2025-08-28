import { AcknowledgmentToken } from "./types";
import { AcknowledgmentTokenRepository } from "./repository";
import { Edge } from "@/modules/edge";
import { OpenApiEndpointRoute } from "../types";

export class AcknowledgmentTokenService {
    constructor(private readonly repository: AcknowledgmentTokenRepository) {
    }

    getAcknowledgmentToken(edge: Edge, endpoint: OpenApiEndpointRoute): AcknowledgmentToken {
        const token = this.repository.find(edge, endpoint);
        if (token) {
            return token;
        }
        return this.repository.add(edge, endpoint);
    }
}