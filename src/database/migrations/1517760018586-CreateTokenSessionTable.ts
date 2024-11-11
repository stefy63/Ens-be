import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateTokenSessionTable1517760018586 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE \`ens2_token_session\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`id_user\` int(11) NULL,
                \`id_operator\` int(11) NULL,
                \`token_session\` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
                \`token_expire_date\` datetime DEFAULT current_timestamp,
                PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;`
          );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE \`ens2_token_session\``);
    }

}
