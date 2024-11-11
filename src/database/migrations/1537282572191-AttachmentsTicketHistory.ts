import { MigrationInterface, QueryRunner } from "typeorm";

export class AttachmentsTicketHistory1537282572191 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE \`ens2_ticket_history_attachment\`
            (
                \`id\`               INT NOT NULL auto_increment,
                \`id_ticket_history\`   INT NOT NULL,
                \`path\`          VARCHAR(255) NOT NULL,
                \`name\`          VARCHAR(255) NOT NULL,
                PRIMARY KEY(\`id\`)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE ens2_ticket_history_attachment`);
    }

}
