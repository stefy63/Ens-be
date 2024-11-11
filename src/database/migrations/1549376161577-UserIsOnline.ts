import {MigrationInterface, QueryRunner} from "typeorm";

export class UserIsOnline1549376161577 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE \`ens2_user\` ADD \`isOnline\` TINYINT(1) NOT NULL DEFAULT '1';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE \`ens2_user\` DROP  \`isOnline\`;
        `);
    }

}
