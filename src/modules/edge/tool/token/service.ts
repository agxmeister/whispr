import { AcknowledgmentToken } from "./types";
import { AcknowledgmentTokenRepository } from "./repository";
import { Edge } from "@/modules/edge";
import { ApiEndpoint } from "../types";

export class AcknowledgmentTokenService {
    constructor(private readonly repository: AcknowledgmentTokenRepository) {
    }

    getAcknowledgmentToken(edge: Edge, endpoint: ApiEndpoint): AcknowledgmentToken {
        const token = this.repository.find(edge, endpoint);
        if (token) {
            return token;
        }
        return this.repository.add(edge, endpoint);
    }
}