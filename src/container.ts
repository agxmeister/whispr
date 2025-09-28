import { Container } from "inversify";
import { LoggerService } from "@/modules/logger";
import { join } from "path";

export const dependencies = {
    LoggerService: Symbol.for("LoggerService"),
} as const;

const container = new Container();

container.bind(dependencies.LoggerService).toDynamicValue(() => {
    return new LoggerService(join(__dirname, '../logs/app.log'));
});

export {container}
