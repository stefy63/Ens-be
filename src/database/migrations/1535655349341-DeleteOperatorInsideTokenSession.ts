import {MigrationInterface, QueryRunner} from "typeorm";

export class DeleteOperatorInsideTokenSession1535655349341 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE ens2_token_session DROP \`id_operator\``);
        await queryRunner.query(`TRUNCATE TABLE ens2_token_session`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return Promise.resolve();
    }

}
