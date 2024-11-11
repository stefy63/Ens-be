import { Service } from "typedi";
import * as Mustache from "mustache";
import * as fs from "fs";
import { Logger } from "../../decorators/Logger";
import { LoggerInterface } from "../../core/LoggerInterface";
import { env } from '../../core/env';

@Service()
export class TemplateRender {
    constructor(@Logger(__filename) private log: LoggerInterface) {
    }

    public async renderFromFile(pathFile: string, context: any): Promise<string> {
        this.log.debug("render content from file", pathFile, context);
        return new Promise<string>(
            (resolve, reject) => {
                fs.readFile(pathFile, ((error, contentBuffer: Buffer) => {
                    if (error) {
                        reject(error);
                    }
                    context.imgSrc = env.app.emailLogoUrl;
                    resolve(Mustache.render(contentBuffer.toString('utf8'), context));
                }));
            }
        );
    }
}
