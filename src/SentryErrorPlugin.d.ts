import { PluginConfig, Plugin, BaseApp, HandleRequest } from 'jovo-core';
export interface Config extends PluginConfig {
    dsn: string;
}
export declare class SentryErrorPlugin implements Plugin {
    config: Config;
    constructor(config?: Config);
    /**
     * Hooks up plugin to the "fail" middleware
     * @param app
     */
    install(app: BaseApp): void;
    uninstall(app: BaseApp): void;
    /**
     * Will be called every time an error occurs
     * @param handleRequest contains current app?, host?, jovo? and error? instance
     */
    error(handleRequest: HandleRequest): void;
    /**
     * Creates log, which will be added to the .pug file
     * @param handleRequest contains current app?, host?, jovo? and error? instance
     */
    createErrorLog(handleRequest: HandleRequest): {
        error: Error;
        session: import("jovo-core").SessionData | undefined;
        request: import("jovo-core").JovoRequest;
        stackTrace: string | undefined;
        userId: string | undefined;
        timestamp: string;
        locale: string;
        platform: string;
        state: any;
        intent: string | undefined;
    } | null;
}
