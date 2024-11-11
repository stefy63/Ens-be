import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTicketTable1517174167313 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE \`ens2_ticket\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`id_service\` int(11) NOT NULL,
                \`id_operator\` int(11) NULL,
                \`id_user\` int(11) NULL,
                \`id_status\` int(11) NOT NULL,
                \`id_category\` int(11) NOT NULL DEFAULT '0',
                \`phone\` varchar(20) COLLATE utf8mb4_unicode_ci NULL,
                \`date_time\` TIMESTAMP DEFAULT current_timestamp,
                \`closed\` tinyint(1) NOT NULL DEFAULT '0',
                \`deleted\` tinyint(1) NOT NULL DEFAULT '0',
                PRIMARY KEY (\`id\`),
                KEY \`id_service\` (\`id_service\`),
                KEY \`id_operator\` (\`id_operator\`),
                KEY \`id_user\` (\`id_user\`),
                KEY \`id_status\` (\`id_status\`),
                KEY \`id_category\` (\`id_category\`)
                ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE \`ens2_ticket\``);
    }

}
