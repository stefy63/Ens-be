import {MigrationInterface, QueryRunner} from "typeorm";

export class UserFixTables1535896594361 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE ens2_user_data MODIFY card_number VARCHAR(255) NULL DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE ens2_user MODIFY id INT(11) NOT NULL AUTO_INCREMENT`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return Promise.resolve();
    }
}

