import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateTicketStatus1517178818303 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE \`ens2_ticket_status\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`status\` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
                PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;`
          );

        await queryRunner.query(`
              INSERT INTO \`ens2_ticket_status\` (\`status\`) VALUES
              (\'NEW\'), (\'ONLINE\'), (\'CLOSED\'), (\'ARCHIVED\'), (\'REFUSED\'), (\'DELETED\'), (\'UNAVAILABLE\');
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE \`ens2_ticket_status\``);
    }

}
