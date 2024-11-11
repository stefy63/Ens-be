import { JsonController, Get, CurrentUser, Req, Authorized, HttpError } from 'routing-controllers';
// import { Logger, LoggerInterface } from '../../decorators/Logger';
import { ResponseSchema } from 'routing-controllers-openapi';
import { StatisticsResponse } from './responses/StatisticsResponse';
import { TokenInfoInterface } from 'src/auth/TokenInfoInterface';
import { User } from '../models/User';
import { QueryStatisticsRequest } from './requests/StatisticsRequest';
import { ValidatorApplier } from '../validators/ValidatorApplier';
import { StatisticsService } from '../services/StatisticsService';
import {assign} from 'lodash';
import moment = require('moment');

@JsonController('/statistics')
export class StatisticsController {

    constructor(
        // @Logger(__filename) private log: LoggerInterface,
        private validatorApplier: ValidatorApplier,
        private statisticsService: StatisticsService
    ) { }


    @Authorized('statistics.view')
    @Get('/')
    @ResponseSchema(StatisticsResponse)
    public async find(@CurrentUser({ required: false }) user: TokenInfoInterface<User>, @Req() req: QueryStatisticsRequest): Promise<any> {
        req = assign(new QueryStatisticsRequest(), req);
        if (moment(req.query.fromDate).isAfter(req.query.toDate)) {
            throw new HttpError(404, 'FROM_DATE_AFTER_TO_DATE');
        }
        await this.validatorApplier.apply<QueryStatisticsRequest>(req);
        const id_office = (user.detail) ? user.detail.id_office : undefined;
        return this.statisticsService.getStatistics(req.query.fromDate, req.query.toDate, id_office);
    }


}
