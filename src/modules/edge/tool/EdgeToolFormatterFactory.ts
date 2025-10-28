import {injectable} from "inversify";
import {FormatterFactory, Formatter} from "@/modules/tool/formatter";
import {EdgeToolFormatter} from "./EdgeToolFormatter";

@injectable()
export class EdgeToolFormatterFactory implements FormatterFactory {
    create(): Formatter {
        return new EdgeToolFormatter();
    }
}
