import {MigrationInterface, QueryRunner} from 'typeorm';

export class CretateServiceCalendarTable1534155607968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE \`ens2_service_calendar\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`id_service\` int(11) NOT NULL,
                \`time_start\` time NULL,
                \`time_end\` time NULL,
                \`weekday_start\` int(11) NOT NULL DEFAULT '0',
                \`weekday_end\` int(11) NOT NULL DEFAULT '0',
                \`monthday_start\` int(11) NOT NULL DEFAULT '0',
                \`monthday_end\` int(11) NOT NULL DEFAULT '0',
                \`month_start\` int(11) NOT NULL DEFAULT '0',
                \`month_end\` int(11) NOT NULL DEFAULT '0',
                PRIMARY KEY (\`id\`)
                );`
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE \`ens2_service_calendar\``);
    }

}
