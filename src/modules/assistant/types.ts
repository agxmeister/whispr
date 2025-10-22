import {Tool} from "@/modules/tool";

export interface Assistant {
    getName(): string;
    getDescription(): string;
    getTools(): Tool[];
}

export type AssistantConstructor<Options = unknown> = new (options: Options) => Assistant;