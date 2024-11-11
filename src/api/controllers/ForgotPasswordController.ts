import { Get, Param, OnUndefined, Put, Body, JsonController, Post, HttpError } from 'routing-controllers';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { User } from '../models/User';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { UserPaaswordNotUpdatedError} from '../errors/UserControllerError';
import { UserService } from '../services/UserService';
import { Md5 } from 'md5-typescript';
import { ResponseSchema } from 'routing-controllers-openapi';
import { ChangePasswordRequest } from './requests/ChangePasswordRequest';
import { ValidatorApplier } from '../validators/ValidatorApplier';
import { assign } from "lodash";
import { EmailForgotRequest } from './requests/EmailForgotRequest';
import { TokenCalculator } from '../token/TokenCalculator';
import { RedisStore } from '../utils/RedisStore';
import * as path from "path";
import { TemplateRender } from '../utils/TemplateRender';
import { MailerClient } from '../utils/MailerClient';
import { env } from '../../core/env';
import { RoleType } from '../enums/Role.enum';
import { UserDataService } from '../services/UserDataService';
import { UserData } from '../models/UserData';

@JsonController('/forgot_password')
export class ForgotPasswordController {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        private userService: UserService,
        private userDataService: UserDataService,
        private validatorApplier: ValidatorApplier,
        private tokenCalculate: TokenCalculator,
        private templateRender: TemplateRender,
        private redisStore: RedisStore,
        private mailerClient: MailerClient
    ) { }

    @Get('/:key')
    public async checkKey(@Param('key') key: string): Promise<boolean> {
        const key_value = await this.redisStore.get(key);
        if (!key_value) {
            throw new HttpError(404, 'KEY_EXPIRED');
        }
        return true;
    }


    @Post()
    public async sendMail(@Body() emailManagerRequest: EmailForgotRequest): Promise<boolean> {
        emailManagerRequest = assign(new EmailForgotRequest(), emailManagerRequest);
        await this.validatorApplier.apply<EmailForgotRequest>(emailManagerRequest);
        const userData: valueOrUndefined<UserData> = await this.userDataService.find({
            relations: ['user'],
            where: {
                email: emailManagerRequest.email,
            },
        });
        if (!userData) {
            throw new HttpError(404, 'USER_OR_EMAIL_NOT_FOUND');
        }
        if (!emailManagerRequest.return_link) {
            if (userData.user.id_role === RoleType.OPERATOR) {
                emailManagerRequest.return_link = env.backoffice.url;
            } else {
                emailManagerRequest.return_link = env.fronoffice.url;
            }
        }

        const key = await this.tokenCalculate.getAccesToken();
        await this.redisStore.save(key, userData.user.id);
        await this.redisStore.expire(key, env.app.redisKeyTimeout);

        const templateEmailPath = path.join(__dirname, `../../templates/forgot-password.mustache`);
        const forgotEmailContent = await this.templateRender.renderFromFile(templateEmailPath,
            {
                name: userData.name,
                surname: userData.surname,
                username: userData.user.username,
                link: `${emailManagerRequest.return_link}/success_forgot/${key}`,
            });

        await this.mailerClient.send(userData.email, `Ermes: Recupera Password`, forgotEmailContent);
        return true;
    }

    @Put('/:key')
    @ResponseSchema(User)
    @OnUndefined(UserPaaswordNotUpdatedError)
    public async forgotChangePassword(@Param('key') key: string, @Body({ required: true }) req: ChangePasswordRequest): Promise<valueOrUndefined<any>> {
        req = assign(new ChangePasswordRequest(), req);
        await this.validatorApplier.apply<ChangePasswordRequest>(req);

        const key_value = await this.redisStore.get(key);
        if (!key_value) {
            throw new HttpError(404, 'KEY_EXPIRED');
        }
        const user = await this.userService.findOneById(key_value);
        if (!user) {
            throw new HttpError(404, 'USER_NOT_FOUND');
        }
        this.log.info('Find User Forgot Password: ', user);
        user.password = Md5.init(req.new_password);
        await this.userService.update(user);
        await this.redisStore.del(key);
        return user;
    }
}
