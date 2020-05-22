"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = require("@sentry/node");
const _merge = require("lodash.merge");
class SentryErrorPlugin {
    constructor(config) {
        // default config
        this.config = {
            dsn: ''
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    /**
     * Hooks up plugin to the "fail" middleware
     * @param app
     */
    install(app) {
        if (!this.config.dsn)
            throw new Error(`Couldn't initialize Raven, missing dsn parameter`);
        Sentry.init({
            dsn: this.config.dsn,
            enabled: this.config.enabled
        });
        // errors
        app.middleware('fail').use(this.error.bind(this));
    }
    uninstall(app) {
    }
    /**
     * Will be called every time an error occurs
     * @param handleRequest contains current app?, host?, jovo? and error? instance
     */
    error(handleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        const log = this.createErrorLog(handleRequest);
        if (log) {
            Sentry.configureScope(scope => {
                scope.setTag('locale', log.locale);
                scope.setTag('platform', log.platform);
                if (log.intent)
                    scope.setTag('intent', log.intent);
                scope.setTag('state', log.state);
                scope.setExtra('request', log.request);
                scope.setExtra('session', log.session);
                scope.setUser({ id: log.userId });
            });
            Sentry.captureException(handleRequest.error);
        }
    }
    /**
     * Creates log, which will be added to the .pug file
     * @param handleRequest contains current app?, host?, jovo? and error? instance
     */
    createErrorLog(handleRequest) {
        if (!handleRequest.jovo) {
            return null;
        }
        const data = {
            error: handleRequest.error,
            session: handleRequest.jovo.getSessionAttributes(),
            request: handleRequest.jovo.$request,
            stackTrace: handleRequest.error.stack,
            userId: handleRequest.jovo.$user.getId(),
            timestamp: handleRequest.jovo.$request.getTimestamp(),
            locale: handleRequest.jovo.$request.getLocale(),
            platform: handleRequest.jovo.constructor.name,
            state: handleRequest.jovo.getState() ? handleRequest.jovo.getState() : '-',
            intent: handleRequest.jovo.$request.getIntentName()
        };
        return data;
    }
}
exports.SentryErrorPlugin = SentryErrorPlugin;
//# sourceMappingURL=SentryErrorPlugin.js.map