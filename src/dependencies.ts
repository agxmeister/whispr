export const dependencies = {
    LoggerService: Symbol.for("LoggerService"),
    ConfigRepository: Symbol.for("ConfigRepository"),
    ConfigService: Symbol.for("ConfigService"),
    ProfileService: Symbol.for("ProfileService"),
    EdgeRepository: Symbol.for("EdgeRepository"),
    EdgeService: Symbol.for("EdgeService"),
} as const;
