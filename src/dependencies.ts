export const dependencies = {
    LoggerService: Symbol.for("LoggerService"),
    ConfigRepository: Symbol.for("ConfigRepository"),
    ConfigService: Symbol.for("ConfigService"),
    ProfileService: Symbol.for("ProfileService"),
    EdgeRepository: Symbol.for("EdgeRepository"),
    EdgeService: Symbol.for("EdgeService"),
    AssistantRegistry: Symbol.for("AssistantRegistry"),
    AssistantService: Symbol.for("AssistantService"),
    EdgeToolMiddlewaresFactory: Symbol.for("EdgeToolMiddlewaresFactory"),
    EdgeToolService: Symbol.for("EdgeToolService"),
    ProcessorFactory: Symbol.for("ProcessorFactory"),
    McpService: Symbol.for("McpService"),
} as const;
