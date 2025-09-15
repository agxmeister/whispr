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

export type AssistantRegistry = Record<string, new (options: any) => AssistantFactory>;