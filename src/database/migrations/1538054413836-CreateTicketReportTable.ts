import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTicketReportTable1538054413836 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE \`ens2_ticket_report\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`id_ticket\` int(11) NOT NULL,
                \`number\` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
                \`id_call_type\`  int(11) NULL,
                \`id_call_result\`  int(11) NULL,
                PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;`
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE ens2_ticket_report`);
    }

}
