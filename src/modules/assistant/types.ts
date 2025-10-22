import {Tool} from "@/modules/tool";

export interface Assistant {
    readonly name: string;
    readonly description: string;
    readonly tools: Tool[];
}

export type AssistantConstructor<Options = unknown> = new (options: Options) => Assistant;