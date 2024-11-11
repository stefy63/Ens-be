import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCallTypeTable1537972201355 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE \`ens2_call_type\`
            (
                \`id\`               INT NOT NULL auto_increment,
                \`type\`             VARCHAR(50) NOT NULL,
                PRIMARY KEY(\`id\`)
            )
        `);
        await queryRunner.query(`
            INSERT INTO \`ens2_call_type\` (\`type\`) VALUES
            (\'PUBBLICO\'), (\'PAGAMENTO\'), (\'VERDE\'), (\'SERVIZIO\'), (\'LAVORO\', (\'PRIVATO\');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE ens2_call_type`);
    }

}
