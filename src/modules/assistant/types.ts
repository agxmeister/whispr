import {Tool} from "@/modules/tool";

export interface Assistant {
    readonly name: string;
    readonly description: string;
    readonly tools: Tool[];
}

export interface AssistantFactory {
    create(): Promise<Assistant>;
}

export type AssistantFactoryConstructor = new (...args: any[]) => AssistantFactory;