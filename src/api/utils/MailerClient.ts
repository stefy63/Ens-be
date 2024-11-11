import * as NodeMailer from "nodemailer";
import { env } from "../../core/env";
import { SMTPConfig } from "../types/SMTPConfig.type";
import { Service } from "typedi";
import { LoggerInterface } from "../../core/LoggerInterface";
import { Logger } from "../../decorators/Logger";

@Service()
export class MailerClient {
    private mailer;

    constructor(@Logger(__filename) private log: LoggerInterface) {
        this.mailer = NodeMailer.createTransport(env.SMTPConfig as SMTPConfig);
    }

    public send(recipient: string, subject: string, body: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.mailer.sendMail({
                from: env.email.sender,
                to: recipient,
                subject,
                html: body,
            }, (error, result) => {
                if (error) {
                    this.log.error(`Error in sending email ${error.toString()}`);
                    reject(error);
                }
                this.log.debug(`Sending email ${recipient}`);
                resolve();
            });
        });
    }
}
