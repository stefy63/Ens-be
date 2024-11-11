
export function normalizePort(val: any): number | string | boolean {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port > 0) {
        // port number
        return port;
    }

    return false;
}
