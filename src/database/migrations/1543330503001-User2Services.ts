import { MigrationInterface, QueryRunner } from "typeorm";

export class User2Services1543330503001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE \`ens2_userToServices\` (
            \`id\` int(11) NOT NULL AUTO_INCREMENT,
            \`id_user\` int(11) NOT NULL,
            \`id_service\` int(11) NOT NULL,
            PRIMARY KEY(\`id\`)
        )`);

        await queryRunner.query(`
            ALTER TABLE \`ens2_userToServices\`
            ADD KEY \`id_service\` (\`id_service\`),
            ADD KEY \`id_user\` (\`id_user\`);
        `);

        await queryRunner.query(`
            ALTER TABLE \`ens2_userToServices\`
                ADD CONSTRAINT \`ens2_usertoservices_ibfk_1\` FOREIGN KEY (\`id_user\`) REFERENCES \`ens2_user\` (\`id\`),
                ADD CONSTRAINT \`ens2_usertoservices_ibfk_2\` FOREIGN KEY (\`id_service\`) REFERENCES \`ens2_ticket_service\` (\`id\`);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return Promise.resolve();
    }
}
