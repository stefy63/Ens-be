
export class TokenCalculator {

    public getAccesToken(): Promise<string> {
        const uuidv4 = require('uuid/v4');
        return Promise.resolve(uuidv4());
    }
}
