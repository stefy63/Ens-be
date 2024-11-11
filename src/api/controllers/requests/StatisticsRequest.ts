import { IsDate } from 'class-validator';

// tslint:disable-next-line:max-classes-per-file
export class StatisticsRequest {

    @IsDate()
    public fromDate: Date;

    @IsDate()
    public toDate: Date;
}

// tslint:disable-next-line:max-classes-per-file
export class QueryStatisticsRequest {
    public query: StatisticsRequest;
}
