import fs from "fs";
import { AcknowledgmentToken } from "./types";
import { Edge } from "@/modules/edge";
import { OpenApiEndpointRoute } from "../types";

export class AcknowledgmentTokenRepository {
    constructor(readonly filePath: string) {
    }

    getAll(): AcknowledgmentToken[] {
        try {
            if (fs.existsSync(this.filePath)) {
                const content = fs.readFileSync(this.filePath, 'utf8');
                return JSON.parse(content);
            }
        } catch (error) {
            console.warn(`Failed to load acknowledgment tokens from ${this.filePath}:`, error);
        }
        return [];
    }

    find(edge: Edge, endpoint: OpenApiEndpointRoute): AcknowledgmentToken | null {
        const tokens = this.getAll();
        const endpointKey = this.createEndpointKey(endpoint);
        return tokens.find(token => token.edge === edge.name.toLowerCase() && token.endpoint === endpointKey) || null;
    }

    add(edge: Edge, endpoint: OpenApiEndpointRoute): AcknowledgmentToken {
        const token: AcknowledgmentToken = {
            code: this.generateCode(),
            edge: edge.name.toLowerCase(),
            endpoint: this.createEndpointKey(endpoint),
            created: new Date().toISOString()
        };

        try {
            const tokens = this.getAll();
            tokens.push(token);
            this.save(tokens);
        } catch (error) {
            console.error(`Failed to add acknowledgment token to ${this.filePath}:`, error);
        }

        return token;
    }

    private createEndpointKey(endpoint: OpenApiEndpointRoute): string {
        return `${endpoint.method.toLowerCase()}${endpoint.path.toLowerCase().split('/').join('-')}`;
    }

    private generateCode(): string {
        const randomDigits = () => Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${Math.floor(Math.random() * 100).toString().padStart(2, '0')}-${randomDigits()}-${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
    }

    private save(tokens: AcknowledgmentToken[]): void {
        try {
            const dir = this.filePath.substring(0, this.filePath.lastIndexOf('/'));
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.filePath, JSON.stringify(tokens, null, 4));
        } catch (error) {
            console.error(`Failed to save acknowledgment tokens to ${this.filePath}:`, error);
        }
    }
}