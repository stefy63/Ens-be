import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDescriptionFieldTicketServiceTable1587033905267 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE ens2_ticket_service ADD COLUMN description TEXT AFTER service`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return Promise.resolve();
    }

}
