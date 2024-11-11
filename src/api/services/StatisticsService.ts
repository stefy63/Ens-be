import { Service } from 'typedi';
import { LoggerInterface, Logger } from '../../decorators/Logger';
import { SubStatistics } from '../controllers/responses/StatisticsResponse';
import { getManager } from 'typeorm';
import moment = require('moment');

@Service()
export class StatisticsService {

    constructor(
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public async getStatistics(from_date: Date, to_date: Date, id_office: any): Promise<SubStatistics[]> {
        this.log.info(`Get statistics from date: [${moment(from_date).format('L')}] to date: [${moment(to_date).format('L')}]`);
        // tslint:disable-next-line:max-line-length
        let query = `SELECT YEAR(date_time) ticket_year, MONTH(date_time) ticket_month, id_service ticket_service, ser.service ticket_service_name, off.id ticket_office, off.office ticket_office_name, usr.id ticket_operator, usr_data.surname ticket_operator_surname, usr_data.name ticket_operator_name, COUNT(*) ticket_sub_total
        FROM ens2_ticket
        INNER JOIN ens2_user usr ON id_operator = usr.id
        INNER JOIN ens2_user_data usr_data ON usr.id_userdata = usr_data.id
        INNER JOIN ens2_office off ON usr.id_office = off.id
        INNER JOIN ens2_ticket_service ser ON id_service = ser.id
        WHERE date_time BETWEEN '${moment(from_date).format('YYYY-MM-DD 00:00:00')}' AND '${moment(to_date).format('YYYY-MM-DD 23:59:59')}'`;
        query += (id_office) ? ` AND off.id = ${id_office} ` : ' ';
        query += `GROUP BY ticket_year, ticket_month, ticket_service, ticket_office, ticket_operator
        ORDER BY ticket_year, ticket_month, ticket_service, ticket_office, ticket_operator`;

        return await getManager().query(query);


    }


}
