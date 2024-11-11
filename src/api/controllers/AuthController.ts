import { CurrentUser, JsonController, Post, Get, NotFoundError, Authorized, Body, OnUndefined, HttpError } from "routing-controllers";
import { LoginService } from '../services/LoginService';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { TokenInfoInterface } from '../../auth/TokenInfoInterface';
import { TokenSession } from '../models/TokenSession';
import { TokenSessionService } from '../services/TokenSessionService';
import { TicketStatusService } from '../services/TicketStatusService';
import { TicketServiceService } from '../services/TicketServiceService';
import { TicketCategoryService } from '../services/TicketCategoryService';
import { TicketHistoryTypeService } from '../services/TicketHistoryTypeService';
import { LoginRequest } from "./requests/LoginRequest";
import { DefaultDialogService } from '../services/DefaultDialogService';
import { User } from "../models/User";
import { UserNotFoundError } from '../errors/OperatorNotFoundError';
import { CallResultService } from '../services/CallResultService';
import { CallTypeService } from '../services/CallTypeService';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { AuthService } from "../../auth/AuthService";
import { OfficeService } from "../services/OfficeService";
import { ResponseSchema } from 'routing-controllers-openapi';
import { ValidatorApplier } from "../validators/ValidatorApplier";
import { assign } from "lodash";
import { AuthLoginResponse } from './responses/AuthLoginResponse';
import { events } from '../subscribers/events';
import { EventDispatcherInterface, EventDispatcher } from '../../decorators/EventDispatcher';
import { UserService } from '../services/UserService';
import { RoleType } from '../enums/Role.enum';

@JsonController()
export class AuthController {

    constructor(
        private loginService: LoginService,
        private tokenSessionService: TokenSessionService,
        private ticketStatusService: TicketStatusService,
        private ticketServiceService: TicketServiceService,
        private ticketCategoryService: TicketCategoryService,
        private ticketHistoryTypeService: TicketHistoryTypeService,
        private defaulDialogService: DefaultDialogService,
        private callTypeService: CallTypeService,
        private callResultService: CallResultService,
        private authService: AuthService,
        private officeService: OfficeService,
        private validatorApplier: ValidatorApplier,
        private userService: UserService,
        @Logger(__filename) private log: LoggerInterface,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface
    ) { }

    @Post('/login')
    @OnUndefined(UserNotFoundError)
    @ResponseSchema(AuthLoginResponse)
    public async login(@Body({ required: true }) req: LoginRequest): Promise<User> {
        req = assign(new LoginRequest(), req);
        await this.validatorApplier.apply<LoginRequest>(req);

        const usFind: valueOrUndefined<User> = await this.userService.findOne({
            where: {
                username: req.username,
            },
        });
        if (!usFind) {
            throw new HttpError(404, 'USER_NOT_FOUND');
        }
        if (usFind.disabled === true) {
            throw new HttpError(404, 'USER_DISABLED');
        }
        let user: valueOrUndefined<User> = await this.loginService.perform(req);
        if (!user) {
            throw new HttpError(401, 'WRONG_PASSWORD');
        }

        const message: any = {};
        message['token'] = user.token as TokenSession;
        message['user'] = user;
        message['ticket_status'] = await this.ticketStatusService.find();
        message['ticket_service'] = await this.ticketServiceService.find();
        message['ticket_category'] = await this.ticketCategoryService.find((user.role.id === RoleType.USER) ? { where: { deleted: false }} : undefined);
        message['ticket_history_type'] = await this.ticketHistoryTypeService.find();
        message['default_dialog'] = await this.defaulDialogService.find();
        message['call_type'] = await this.callTypeService.find();
        message['call_result'] = await this.callResultService.find();
        message['services'] = user.services;
        message['offices'] = (user.office) ? [user.office] : await this.officeService.getAll();

        await this.authService.saveUserContext(user, user.token.token_session);
        this.eventDispatcher.dispatch(events.user.login, user);
        this.log.info(`Login successfully userId: ${user.id} - token: ${message['token'].token_session}`);
        return message;
    }

    @Authorized()
    @Post('/logout')
    public async logout(@CurrentUser({ required: true }) userTokenInfo: TokenInfoInterface<User>): Promise<boolean> {
        if (!userTokenInfo.detail) {
            throw new NotFoundError('Logout error because user not found!');
        }

        let user: User = userTokenInfo.detail;
        await this.tokenSessionService.delete(user.token);
        await this.authService.clearContextFor(user);
        this.eventDispatcher.dispatch(events.user.logout, user);
        this.log.info(`Logout successfully userId: ${user.id}`);
        return true;
    }

    @Authorized()
    @Get('/tokeninfo')
    @OnUndefined(UserNotFoundError)
    @ResponseSchema(User)
    public async tokeninfo(@CurrentUser({ required: true }) userTokenInfo: TokenInfoInterface<User>): Promise<User> {
        if (!userTokenInfo.detail) {
            throw new NotFoundError('User not found!');
        }

        let user: User = userTokenInfo.detail;
        this.log.info(`Tokeninfo successfully userId: ${user.id}`);
        return user;
    }

}
