import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateHistoryTable1517175350287 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE \`ens2_ticket_history\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`id_ticket\` int(11) NOT NULL,
                \`id_type\` int(11) NOT NULL,
                \`action\` text COLLATE utf8mb4_unicode_ci NULL,
                \`date_time\` TIMESTAMP DEFAULT current_timestamp,
                \`readed\` tinyint(1) DEFAULT '0',
                PRIMARY KEY (\`id\`),
                KEY \`id_ticket\` (\`id_ticket\`)
                ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;`
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE \`ens2_ticket_history\``);
    }

}
