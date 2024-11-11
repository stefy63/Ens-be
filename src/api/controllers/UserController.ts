import { assign, join, map } from "lodash";
import { Md5 } from 'md5-typescript';
import * as path from "path";
import { Authorized, Body, CurrentUser, Get, HttpError, JsonController, OnUndefined, Param, Post, Put, Req, Res } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import * as useragent from "useragent";
import { TokenInfoInterface } from '../../auth/TokenInfoInterface';
import { env } from '../../core/env';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { UserPermissionChecker } from '../checkers/UserPermissionChecker';
import { RoleType } from '../enums/Role.enum';
import { UserNotCreatedError, UserNotFoundError, UserNotUpdatedError, UserPaaswordNotUpdatedError } from '../errors/UserControllerError';
import { WrongPasswordError } from '../errors/WrongPasswordError';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { events } from '../subscribers/events';
import { TokenCalculator } from '../token/TokenCalculator';
import { UserRequest } from '../types/UserRequest.type';
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { MailerClient } from '../utils/MailerClient';
import { RedisStore } from '../utils/RedisStore';
import { TemplateRender } from '../utils/TemplateRender';
import { ValidatorApplier } from '../validators/ValidatorApplier';
import { ChangePasswordRequest } from './requests/ChangePasswordRequest';
import { PaginationRequest } from './requests/PaginationRequest';
import { PaginationResponse } from "./responses/PaginationResponse";
import { UserPaginationResponse } from './responses/UserPaginationResponse';

@JsonController('/user')
export class UserController {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        private userService: UserService,
        // private userdataService: UserDataService,
        private validatorApplier: ValidatorApplier,
        private tokenCalculate: TokenCalculator,
        private redisStore: RedisStore,
        private templateRender: TemplateRender,
        private mailerClient: MailerClient,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface
    ) { }

    @Authorized('operator.get.all')
    @Post("/operator-export")
    @OnUndefined(UserNotFoundError)
    // tslint:disable-next-line: max-line-length
    public async findAllOP(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Req() req: any, @Body() filterBody: {filter: string}, @Res() response: any): Promise<valueOrUndefined<User[]>> {
        const result = await this.userService.findOperator(filterBody.filter);

        // tslint:disable-next-line:max-line-length
        const isWindows = useragent.parse(req.headers['user-agent']).os.toString().includes('Windows');
        const EOL = (isWindows) ? '\r\n' : '\n';
        const CSV_DELIMITER_CHAR = ";";
        let csvContent = join([
            'USERNAME',
            'ID_ANAGRAFICA',
            'NOME',
            'COGNOME',
            'EMAIL',
            'CHANNEL',
            'RUOLO',
            'SEDE',
            'ABILITATO',
        ], CSV_DELIMITER_CHAR);
        if (!result) {
            this.log.error('Export operator empty result.', result);
            throw new HttpError(404, 'EXPORT_OPERATOR_EMPTY');
        }
        result.forEach((userRaw: User) => {

            csvContent += EOL;
            csvContent += [
                userRaw.username,
                userRaw.id,
                (userRaw.userdata) ? userRaw.userdata.name : '',
                (userRaw.userdata) ? userRaw.userdata.surname : '',
                (userRaw.userdata) ? userRaw.userdata.email : '',
                map(userRaw.services, item => item.service),
                (userRaw.role) ? userRaw.role.name : '',
                (userRaw.office) ? userRaw.office.office : '',
                (userRaw.disabled) ? 'Disabilitato' : 'Abilitato',
            ].join(CSV_DELIMITER_CHAR);
        });

        this.log.info(`CSV operator File create From User: ${(user.detail as User).id}`);
        response.set('Content-disposition', 'attachment; filename=report_operator.csv');
        response.set('File-Name', 'report_operator.csv');
        response.set('Content-Type', 'text/csv');
        response.set('Access-Control-Expose-Headers', 'File-Name');
        return response.status(200).send(csvContent);
    }

    @Authorized('user.get.all')
    @Post("/user-export")
    @OnUndefined(UserNotFoundError)
    // tslint:disable-next-line: max-line-length
    public async findAllUsers(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Req() req: any, @Body() pagination: PaginationRequest, @Res() response: any): Promise<valueOrUndefined<User[]>> {
        const pageInfo = assign(new PaginationRequest(), pagination, {
            size: '0',
            filter: !!pagination.filter ? pagination.filter : '' ,
            pageNumber: '0',
        });

        const result = await this.userService.findPagedAndFiltered(pageInfo) || undefined;

        // tslint:disable-next-line:max-line-length
        const isWindows = useragent.parse(req.headers['user-agent']).os.toString().includes('Windows');
        const EOL = (isWindows) ? '\r\n' : '\n';
        const CSV_DELIMITER_CHAR = ";";
        let csvContent = join([
            'ID_ANAGRAFICA',
            'USERNAME',
            'NOME',
            'COGNOME',
            'EMAIL',
            'PHONE',
            'ABILITATO',
        ], CSV_DELIMITER_CHAR);
        if (!result) {
            this.log.error('Export users empty result.', result);
            throw new HttpError(404, 'EXPORT_USERS_EMPTY');
        }

        result[0].forEach((userRaw: User) => {
            csvContent += EOL;
            csvContent += [
                userRaw.id,
                userRaw.username,
                (userRaw.userdata) ? userRaw.userdata.name : '',
                (userRaw.userdata) ? userRaw.userdata.surname : '',
                (userRaw.userdata) ? userRaw.userdata.email : '',
                (userRaw.userdata) ? userRaw.userdata.phone : '',
                (userRaw.disabled) ? 'Disabilitato' : 'Abilitato',
            ].join(CSV_DELIMITER_CHAR);
        });

        this.log.info(`CSV users File create From User: ${(user.detail as User).id}`);
        response.set('Content-disposition', 'attachment; filename=report_users.csv');
        response.set('File-Name', 'report_users.csv');
        response.set('Content-Type', 'text/csv');
        response.set('Access-Control-Expose-Headers', 'File-Name');
        return response.status(200).send(csvContent);
    }


    @Authorized(['user.get.all', 'operator.get.all'])
    @Get("/")
    @ResponseSchema(UserPaginationResponse)
    @OnUndefined(UserNotFoundError)
    public async find(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Req() req?: any): Promise<UserPaginationResponse> {
        req = assign(new PaginationRequest(), {
            size: 10,
            filter: '',
            pageNumber: 0,
            onlyOperator: 'false',
        }, req.query);
        req.onlyOperator = (req.onlyOperator === 'true' && user.detail && UserPermissionChecker.hasPermission(user.detail, 'operator.get.all')) ? true : false;

        await this.validatorApplier.apply<PaginationRequest>(req);

        const result = await this.userService.findPagedAndFiltered(req) || [undefined, 0];
        const paginate: PaginationResponse = assign(req, {
            totalElements: result[1],
            totalPages: Math.ceil(result[1] / req.size),
        });
        const message: UserPaginationResponse = {
            page: paginate,
            data: result[0],
        };

        this.log.info('Return User and Operator List with paginations: ', paginate);
        return message;
    }

    @Authorized()
    @Get('/:id')
    @ResponseSchema(User)
    @OnUndefined(UserNotFoundError)
    public async findOne(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Param('id') id: number): Promise<valueOrUndefined<User>> {
        if (!user.detail) {
            this.log.error("User not logged or detail of user is missing");
            return undefined;
        } else if (user.detail.id !== id && !UserPermissionChecker.hasPermission(user.detail, "user.get.all")) {
            this.log.error("User try to update different user");
            return undefined;
        }

        return await this.userService.findOneById(id);
    }

    @Post()
    @OnUndefined(UserNotCreatedError)
    // tslint:disable-next-line: max-line-length
    public async create(@CurrentUser({ required: false }) loggedUser: TokenInfoInterface<User>, @Body() userRequest: UserRequest): Promise<valueOrUndefined<any>> {
        const currenUser = (!!loggedUser && !!loggedUser.detail) ? loggedUser.detail : false;
        const user = assign(new User(), userRequest);
        // tslint:disable-next-line: max-line-length
        const searchUser = await this.userService.findOneByUserOrEmailOrPhone(user.username, user.userdata.email, user.userdata.phone);

        if (!!searchUser && searchUser.username.toLowerCase() === user.username.toLowerCase()) {
            this.log.error('Create User Fail! Username alredy exist.', user.username);
            throw new HttpError(404, 'USER_ALREDY_EXIST');
        } else if (!!searchUser && searchUser.userdata.email === user.userdata.email) {
            this.log.error('Create User Fail! Email alredy exist.', user.username);
            throw new HttpError(404, 'EMAIL_ALREDY_EXIST');
        } else if (!!searchUser && searchUser.userdata.phone === user.userdata.phone) {
            this.log.error('Create User Fail! Phone Number alredy exist.', user.username);
            throw new HttpError(404, 'PHONE_ALREDY_EXIST');
        }

        // tslint:disable-next-line: max-line-length
        if ((user.isOperator || user.id_role > RoleType.USER) && currenUser && !UserPermissionChecker.hasPermission(currenUser, "operator.get.all")) {
            this.log.error('Update User Fail! User not have permission operator.get.all.', user.username);
            throw new HttpError(404, 'USER_HOT_HAVE_PERMISSION');
        }

        if (!user.isOperator) {
            user.isOperator = false;
            user.isOnline = false;
            user.id_role = RoleType.USER;
            user.services = [];
        }
        user.password = Md5.init(user.password);

        this.log.info('create New User: ', user);
        const retUser = await this.userService.create(user);
        if (!retUser) {
            throw new Error('ERROR_IN_CREATING_USER');
        }
        if (!userRequest.noSendMail) {
            const key = `registration__forgot` + await this.tokenCalculate.getAccesToken();
            await this.redisStore.save(key, retUser.id);
            await this.redisStore.expire(key, env.app.redisKeyTimeout);

            const templateEmailPath = path.join(__dirname, `../../templates/registration-confirm.mustache`);
            const forgotEmailContent = await this.templateRender.renderFromFile(templateEmailPath,
                {
                    name: user.userdata.name,
                    surname: user.userdata.surname,
                    username: user.username,
                    link:  `${env.fronoffice.url}/success_registration/${key}`,
                });
            await this.mailerClient.send(user.userdata.email, `Ermes: Conferma Registrazione.`, forgotEmailContent);
        }

        return await this.userService.findOneById(retUser.id);
    }

    @Put('/confirm/:key')
    @ResponseSchema(User)
    @OnUndefined(UserPaaswordNotUpdatedError)
    public async registrationConfirmMail(@Param('key') key: string): Promise<valueOrUndefined<any>> {
        const key_value = await this.redisStore.get(key);
        if (!key_value) {
            throw new HttpError(404, 'KEY_EXPIRED');
        }
        const user = await this.userService.findOneById(key_value);
        if (!user) {
            throw new HttpError(404, 'USER_NOT_FOUND');
        }
        user.disabled = false;

        this.log.info('Find User Confirm Registration: ', user);
        await this.userService.update(user);
        await this.redisStore.del(key);
        return user;
    }

    @Authorized()
    @Put('/password/:id')
    @ResponseSchema(User)
    @OnUndefined(UserPaaswordNotUpdatedError)
    // tslint:disable-next-line:max-line-length
    public async changePasssword(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Param('id') id: number, @Body({ required: true }) req: ChangePasswordRequest): Promise<valueOrUndefined<any>> {
        req = assign(new ChangePasswordRequest(), req);
        await this.validatorApplier.apply<ChangePasswordRequest>(req);

        const permissionPasswordAll: boolean = UserPermissionChecker.hasPermission(user.detail as User, "change.password.allUsers");
        if (!!user.detail
            && user.detail.id !== id
            && !permissionPasswordAll) {
            throw new Error("User not has correct permissions");
        } else if (!permissionPasswordAll && !req.old_password) {
            throw new Error("Old password parameter missing");
        }

        const retUser = await this.userService.findOneById(id);
        if (!retUser) {
            throw new Error("No user found with this id");
        } else if (!permissionPasswordAll && retUser.password !== Md5.init(req.old_password)) {
            throw new WrongPasswordError();
        }

        this.log.info('Find User by ID: ', retUser);
        retUser.password = Md5.init(req.new_password);
        return await this.userService.update(retUser);
    }

    @Authorized()
    @Put()
    @ResponseSchema(User)
    @OnUndefined(UserNotUpdatedError)
    // tslint:disable-next-line:max-line-length
    public async update(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Body() userRequest: User): Promise <valueOrUndefined<User>> {

        userRequest = assign(new User(), userRequest);
        await this.validatorApplier.apply<User>(userRequest);

        // tslint:disable-next-line: max-line-length
        const searchUser = await this.userService.findOneByUserOrEmailOrPhone(userRequest.username, userRequest.userdata.email, userRequest.userdata.phone, userRequest.id);

        if (!!searchUser && searchUser.username.toLowerCase() === userRequest.username.toLowerCase()) {
            this.log.error('Create User Fail! Username alredy exist.', userRequest.username);
            throw new HttpError(404, 'USER_ALREDY_EXIST');
        } else if (!!searchUser && searchUser.userdata.email === userRequest.userdata.email) {
            this.log.error('Create User Fail! Email alredy exist.', userRequest.username);
            throw new HttpError(404, 'EMAIL_ALREDY_EXIST');
        } else if (!!searchUser && searchUser.userdata.phone === userRequest.userdata.phone) {
            this.log.error('Create User Fail! Phone Number alredy exist.', userRequest.username);
            throw new HttpError(404, 'PHONE_ALREDY_EXIST');
        }

        let newUser = await this.userService.findOneById(userRequest.id);
        if (!newUser || !user.detail) {
            throw new Error("User not Found or not connected user object");
        }

        if (
            user && searchUser && user.detail.id !== searchUser.id &&
            (userRequest.isOperator || userRequest.id_role > RoleType.USER) &&
            !UserPermissionChecker.hasPermission(user.detail, "operator.get.all")
        ) {
            this.log.error('Update User Fail! User not have permission operator.get.all.', userRequest.username);
            throw new HttpError(404, 'USER_HOT_HAVE_PERMISSION');
        }

        const originalIsOnline: boolean = newUser.isOnline;
        if (UserPermissionChecker.hasPermission(user.detail, "user.update.all")) {
            delete userRequest.password;
            newUser = userRequest as User;
        } else if (user.detail.id !== userRequest.id) {
            throw new Error("User try to update different user");
        }  else { // the user can only update his username and his userdata
            newUser.username = userRequest.username;
            newUser.userdata = userRequest.userdata;
            newUser.isOnline = userRequest.isOnline;
        }

        await this.userService.update(newUser);
        if (originalIsOnline !== userRequest.isOnline) {
            this.eventDispatcher.dispatch(events.user.changeStatus, newUser);
        }
        return await this.userService.findOneById(userRequest.id);
    }

}
