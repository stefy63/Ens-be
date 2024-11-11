import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUnknownUserData1536056380329 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE \`ens2_user_unknown\`
            (
                \`id\`               INT NOT NULL auto_increment,
                \`email\`             VARCHAR(255) NULL,
                \`phone\`          VARCHAR(255) NULL,
                PRIMARY KEY(\`id\`)
            )
        `);

        await queryRunner.query(`ALTER TABLE ens2_ticket ADD \`id_user_unknown\` INT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE ens2_user_unknown`);
        await queryRunner.query(`ALTER TABLE ens2_ticket DROP \`id_user_unknown\``);
    }

}
