import * as path from 'path';
import * as dotenv from 'dotenv';
import * as pkg from '../../package.json';
import * as moment from 'moment';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`) });
moment.locale('it');

/**
 * Environment variables
 */
export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    fronoffice: {
        url: getOsEnv('FRONT_OFFICE_URL'),
    },
    backoffice: {
        url: getOsEnv('BACK_OFFICE_URL'),
    },
    email: {
        sender: getOsEnv('EMAIL_SENDER'),
        subject: getOsEnv('EMAIL_SUBJECT'),
    },
    SMTPConfig: {
        host: getOsEnv('SMTP_HOST'),
        port: toNumber(getOsEnv('SMTP_PORT')),
        secure: toBool(getOsEnv('SMTP_SECURE')),
        auth: {
            user: getOsEnv('SMTP_AUTH_USER'),
            pass: getOsEnv('SMTP_AUTH_PASS'),
        },
    },
    autoresponder: {
        serviceAvailable: getOsEnv('AUTORESPONDER_SERVICE_AVAILABLE'),
        serviceUnavailable: getOsEnv('AUTORESPONDER_SERVICE_UNAVAILABLE'),
    },
    sms: {
        url: getOsEnv('SMS_URL'),
        id: getOsEnv('SMS_ID'),
        key: getOsEnv('SMS_KEY'),
        sender: getOsEnv('SMS_SENDER'),
    },
    telegram: {
        url: getOsEnv('TELEGRAM_URL'),
    },
    app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        ticketTimeout: getOsEnv('APP_TICKET_TIMEOUT'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        route: getOsEnv('APP_ROUTE') + ':' + normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER')),
        redisKeyTimeout: toNumber(getOsEnv('APP_REDIS_KEY_TIMEOUT')),
        brandTemplatePath: getOsEnv('BRAND_TEMPLATE_PATH'),
        emailLogoUrl: getOsEnv('EMAIL_LOGO_URL'),
        dirs: {
            migrations: [path.relative(path.join(process.cwd()), path.join(__dirname, '..', 'database/migrations/*.ts'))],
            migrationsDir: path.relative(path.join(process.cwd()), path.join(__dirname, '..', 'database/migrations')),
            entities: [path.relative(path.join(process.cwd()), path.join(__dirname, '..', 'api/**/models/*{.js,.ts}'))],
            subscribers: [path.join(__dirname, '..', 'api/**/*Subscriber{.js,.ts}')],
            controllers: [path.join(__dirname, '..', 'api/**/*Controller{.js,.ts}')],
            middlewares: [path.join(__dirname, '..', 'api/**/*Middleware{.js,.ts}')],
            interceptors: [path.join(__dirname, '..', 'api/**/*Interceptor{.js,.ts}')],
            queries: [path.join(__dirname, '..', 'api/**/*Query{.js,.ts}')],
            mutations: [path.join(__dirname, '..', 'api/**/*Mutation{.js,.ts}')],
        },
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnv('LOG_JSON')),
        output: getOsEnv('LOG_OUTPUT'),
    },
    auth: {
        route: getOsEnv('AUTH_ROUTE'),
    },
    db: {
        type: getOsEnv('DB_TYPE'),
        host: getOsEnv('DB_HOST'),
        port: toNumber(getOsEnv('DB_PORT')),
        username: getOsEnv('DB_USERNAME'),
        password: getOsEnv('DB_PASSWORD'),
        database: getOsEnv('DB_DATABASE'),
        synchronize: toBool(getOsEnv('DB_SYNCHRONIZE')),
        logging: toBool(getOsEnv('DB_LOGGING')),
    },
    graphql: {
        enabled: toBool(getOsEnv('GRAPHQL_ENABLED')),
        route: getOsEnv('GRAPHQL_ROUTE'),
        editor: toBool(getOsEnv('GRAPHQL_EDITOR')),
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE'),
        file: getOsEnv('SWAGGER_FILE'),
        username: getOsEnv('SWAGGER_USERNAME'),
        password: getOsEnv('SWAGGER_PASSWORD'),
    },
    monitor: {
        enabled: toBool(getOsEnv('MONITOR_ENABLED')),
        route: getOsEnv('MONITOR_ROUTE'),
        username: getOsEnv('MONITOR_USERNAME'),
        password: getOsEnv('MONITOR_PASSWORD'),
    },
    socketIo: {
        enabled: toBool(getOsEnv('SOCKETIO_ENABLED')),
        port: process.env.SOCKETIO_PORT || getOsEnv('SOCKETIO_PORT'),
        route: getOsEnv('SOCKETIO_ROUTE'),
        path: getOsEnv('SOCKETIO_PATH'),
    },
    redis: {
        host: getOsEnv('REDIS_HOST'),
        port: toNumber(getOsEnv('REDIS_PORT')),
    },
};

function getOsEnv(key: string): string {
    return process.env[key] as string;
}

function toNumber(value: string): number {
    return parseInt(value, 10);
}

function toBool(value: string): boolean {
    return value === 'true';
}

function normalizePort(port: string): number | string | boolean {
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) { // named pipe
        return port;
    }
    if (parsedPort >= 0) { // port number
        return parsedPort;
    }
    return false;
}
