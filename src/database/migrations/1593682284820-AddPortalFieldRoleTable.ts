import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPortalFieldRoleTable1593682284820 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE ens2_role ADD COLUMN portal ENUM('frontoffice', 'backoffice') DEFAULT 'backoffice' AFTER description`);
        await queryRunner.query(`UPDATE ens2_role SET portal = 'frontoffice' WHERE ens2_role.id = 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return Promise.resolve();
    }

}
