import fs from "fs";
import { Token } from "./types";
import { Edge } from "@/modules/edge";
import { OpenApiEndpointRoute } from "@/modules/rest";

export class TokenRepository {
    constructor(readonly filePath: string) {
    }

    getAll(): Token[] {
        try {
            if (fs.existsSync(this.filePath)) {
                const content = fs.readFileSync(this.filePath, 'utf8');
                return JSON.parse(content);
            }
        } catch (error) {
            console.warn(`Failed to load tokens from ${this.filePath}:`, error);
        }
        return [];
    }

    find(edge: Edge, endpoint: OpenApiEndpointRoute): Token | null {
        return this.getAll().find(token =>
            token.edge === edge.name.toLowerCase()
            && token.endpoint.method === endpoint.method.toLowerCase()
            && token.endpoint.path === endpoint.path
        ) || null;
    }

    add(edge: Edge, endpoint: OpenApiEndpointRoute): Token {
        const token: Token = {
            code: this.generateCode(),
            edge: edge.name.toLowerCase(),
            endpoint: {
                method: endpoint.method.toLowerCase(),
                path: endpoint.path
            },
            created: new Date().toISOString()
        };

        try {
            const tokens = this.getAll();
            tokens.push(token);
            this.save(tokens);
        } catch (error) {
            console.error(`Failed to add token to ${this.filePath}:`, error);
        }

        return token;
    }

    private generateCode(): string {
        const randomDigits = () => Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${Math.floor(Math.random() * 100).toString().padStart(2, '0')}-${randomDigits()}-${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
    }

    private save(tokens: Token[]): void {
        try {
            const dir = this.filePath.substring(0, this.filePath.lastIndexOf('/'));
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.filePath, JSON.stringify(tokens, null, 4));
        } catch (error) {
            console.error(`Failed to save tokens to ${this.filePath}:`, error);
        }
    }
}
