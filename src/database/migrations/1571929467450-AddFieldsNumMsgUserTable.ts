import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFieldsNumMsgUserTable1571929467450 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE ens2_ticket ADD COLUMN op_num_history int(11) DEFAULT 0 AFTER phone`);
        await queryRunner.query(`ALTER TABLE ens2_ticket ADD COLUMN user_num_history int(11) DEFAULT 0 AFTER op_num_history`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return Promise.resolve();
    }

}
