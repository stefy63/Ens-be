import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateTicketService1517179052110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE \`ens2_ticket_service\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`service\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
                \`deleted\` tinyint(1) NOT NULL DEFAULT '0',
                PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;`
          );
          
        await queryRunner.query(`
              INSERT INTO \`ens2_ticket_service\` (\`service\`) VALUES
              (\'CHAT\'), (\'SMS\'), (\'MAIL\'), (\'SOCIAL\'), (\'VIDEOCHAT\');
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE \`ens2_ticket_service\``);
    }

}
