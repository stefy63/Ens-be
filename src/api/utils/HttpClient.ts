import { Dictionary } from "lodash";
import { OptionsWithUri, FullResponse } from "request-promise-native";
import { Service } from 'typedi';
// tslint:disable-next-line:no-var-requires
const rqPromise = require("request-promise-native");

@Service()
export class HttpClient {
    public get<T>(url: string, params: Dictionary<string>, headers?: Dictionary<string>): Promise<T> {
        let options: OptionsWithUri = {
            method: "GET",
            uri: url,
            json: true,
            resolveWithFullResponse: true,
            headers,
            qs: params,
        };
        return this.callHttp<T>(options);
    }

    public post<TSource, TResponse>(url: string, body: TSource, headers?: Dictionary<string>): Promise<TResponse> {
        let options: OptionsWithUri = {
            method: "POST",
            uri: url,
            json: true,
            resolveWithFullResponse: true,
            headers,
            body,
        };
        return this.callHttp<TResponse>(options);
    }

    private callHttp<T>(options: OptionsWithUri): Promise<T> {
        return rqPromise(options).promise().then((result: FullResponse) => {
            if (result.statusCode !== 200) {
                return Promise.reject("Chiamata HTTP fallita");
            }

            return Promise.resolve(result.body as T);
        });
    }
}
