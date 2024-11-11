import { Authorized, CurrentUser, Get, JsonController, OnUndefined, Req } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { OrmRepository } from "typeorm-typedi-extensions";
import { TokenInfoInterface } from '../../auth/TokenInfoInterface';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { UserNotFoundError } from '../errors/UserControllerError';
import { User } from '../models/User';
import { UserData } from "../models/UserData";
import { UserDataRepository } from "../repositories/UserDataRepository";
import { valueOrUndefined } from '../types/ValueOrUndefined';
import { ValidatorApplier } from '../validators/ValidatorApplier';
import { UserDataRequest } from "./requests/UserDataRequest";
import { assign } from "nodemailer/lib/shared";
import { mapValues, keys } from "lodash";
import { Like } from 'typeorm';

@JsonController('/userdata')
export class UserDataController {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userDataRepository: UserDataRepository,
        private validatorApplier: ValidatorApplier
    ) { }

    @Authorized("user.get.all")
    @Get("/")
    @ResponseSchema(UserData, {isArray: true})
    @OnUndefined(UserNotFoundError)
    public async find(@CurrentUser({ required: true }) user: TokenInfoInterface<User>, @Req() req?: any): Promise<valueOrUndefined<UserData[]>> {
        if (keys(req.query).length === 0) {
            throw new Error("ONE_PARAMETER_IS_MANDATORY");
        }
        if (req.query) {
            req.query = assign(new UserDataRequest(), req.query);
            await this.validatorApplier.apply<UserDataRequest>(req.query);
        }

        this.log.debug("Find userData with data", req.query);

        return this.userDataRepository.find({
            where: mapValues(req.query, (value) => Like(value)),
        });
    }
}
