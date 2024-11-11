import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAdditionalFieldUserdata1547225594108 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE ens2_user_data ADD COLUMN born_date DATETIME AFTER surname`);
        await queryRunner.query(`ALTER TABLE ens2_user_data ADD COLUMN born_city VARCHAR(255) AFTER born_date`);
        await queryRunner.query(`ALTER TABLE ens2_user_data ADD COLUMN born_province int(11) AFTER born_city`);

        await queryRunner.query(`ALTER TABLE ens2_user_data ADD COLUMN address VARCHAR(255) AFTER city`);
        await queryRunner.query(`ALTER TABLE ens2_user_data ADD COLUMN province int(11) AFTER address`);

        await queryRunner.query(`ALTER TABLE ens2_user_data ADD COLUMN fiscalcode VARCHAR(255) AFTER card_number`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return Promise.resolve();
    }

}
