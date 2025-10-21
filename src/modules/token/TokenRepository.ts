import fs from "fs";
import { Token } from "./types";

export class TokenRepository<T = unknown> {
    constructor(readonly filePath: string) {
    }

    getAll(): Token<T>[] {
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

    find(scope: string, matcher: (payload: T) => boolean): Token<T> | null {
        return this.getAll().find(token =>
            token.scope === scope && matcher(token.payload)
        ) || null;
    }

    add(scope: string, payload: T): Token<T> {
        const token: Token<T> = {
            code: this.generateCode(),
            scope: scope,
            payload: payload,
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

    private save(tokens: Token<T>[]): void {
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
