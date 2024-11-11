import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateTicketCategory1517179052108 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE \`ens2_ticket_category\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`category\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
                \`deleted\` tinyint(1) NOT NULL DEFAULT '0',
                PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;`
          );

        await queryRunner.query(`
            INSERT INTO \`ens2_ticket_category\` (\`category\`) VALUES ('UNCATEGORIZED');
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE \`ens2_ticket_category\``);
    }

}
