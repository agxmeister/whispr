import {Tool} from "@/modules/tool";

export interface Assistant {
    readonly name: string;
    readonly description: string;
    readonly tools: Tool[];
    initialize(): Promise<void>;
}

export type AssistantConstructor = new (...args: any[]) => Assistant;