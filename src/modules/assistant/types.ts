import {Tool} from "@/modules/mcp";

export interface Assistant {
    getName(): string;
    getDescription(): string;
    getTools(): Tool[];
}

export interface AssistantFactory {
    readonly name: string;
    create(options?: Record<string, string>): Assistant;
}