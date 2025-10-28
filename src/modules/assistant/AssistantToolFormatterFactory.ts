import {injectable} from "inversify";
import {FormatterFactory, Formatter} from "@/modules/tool/formatter";
import {AssistantToolFormatter} from "./AssistantToolFormatter";

@injectable()
export class AssistantToolFormatterFactory implements FormatterFactory {
    create(): Formatter {
        return new AssistantToolFormatter();
    }
}
