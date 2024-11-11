import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCallResultTable1537973256520 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE \`ens2_call_result\` 
            (
                \`id\`               INT NOT NULL auto_increment,
                \`type\`             VARCHAR(50) NOT NULL,
                PRIMARY KEY(\`id\`)
            )
        `);
        await queryRunner.query(`
            INSERT INTO \`ens2_call_result\` (\`type\`) VALUES
            (\'OCCUPATO\'), (\'INESISTENTE\'), (\'SEGRETERIA\'), (\'ASSENTE\'), (\'POSITIVO\');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE ens2_call_result`);
    }

}
