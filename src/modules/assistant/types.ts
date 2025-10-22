import {Tool} from "@/modules/tool";

export interface Assistant {
    getName(): string;
    getDescription(): string;
    getTools(): Tool[];
}

export interface AssistantFactory {
    readonly name: string;
    create(options?: Record<string, string>): Assistant;
}

export type AssistantFactoryConstructor = new (options: any) => AssistantFactory;