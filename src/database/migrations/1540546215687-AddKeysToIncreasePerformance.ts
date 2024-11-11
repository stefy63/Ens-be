import {MigrationInterface, QueryRunner} from "typeorm";

export class AddKeysToIncreasePerformance1540546215687 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE ens2_ticket CHANGE id_category id_category INT(11) NULL DEFAULT NULL;
        `);

        await queryRunner.query(`UPDATE ens2_ticket SET id_user=NULL WHERE id_user=0;`);
        await queryRunner.query(`UPDATE ens2_ticket SET id_operator=NULL WHERE id_operator=0;`);
        await queryRunner.query(`UPDATE ens2_ticket SET id_category=NULL WHERE id_category=0;`);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket
            ADD CONSTRAINT ens2_ticket_ibfk_1 FOREIGN KEY (id_operator) REFERENCES ens2_user (id),
            ADD CONSTRAINT ens2_ticket_ibfk_2 FOREIGN KEY (id_service) REFERENCES ens2_ticket_service (id),
            ADD CONSTRAINT ens2_ticket_ibfk_3 FOREIGN KEY (id_user) REFERENCES ens2_user (id),
            ADD CONSTRAINT ens2_ticket_ibfk_4 FOREIGN KEY (id_operator) REFERENCES ens2_user (id),
            ADD CONSTRAINT ens2_ticket_ibfk_5 FOREIGN KEY (id_category) REFERENCES ens2_ticket_category (id),
            ADD CONSTRAINT ens2_ticket_ibfk_6 FOREIGN KEY (id_user_unknown) REFERENCES ens2_user_unknown (id),
            ADD CONSTRAINT ens2_ticket_ibfk_8 FOREIGN KEY (id_status) REFERENCES ens2_ticket_status (id);
        `);

        await queryRunner.query(`ALTER TABLE ens2_ticket_report ADD INDEX (id_ticket);`);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket_report ADD FOREIGN KEY (id_ticket) REFERENCES ens2_ticket (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_user ADD INDEX (id_userdata);
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_user ADD FOREIGN KEY (id_userdata) REFERENCES ens2_user_data (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket_history_attachment ADD INDEX (id_ticket_history);
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket_history_attachment ADD FOREIGN KEY (id_ticket_history) 
            REFERENCES ens2_ticket_history (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_user ADD INDEX (id_userdata);
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_user ADD FOREIGN KEY (id_userdata) REFERENCES ens2_user_data (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket_history ADD INDEX(id_type);
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket_history ADD FOREIGN KEY (id_type) REFERENCES ens2_ticket_history_type (id) ON DELETE RESTRICT ON UPDATE RESTRICT;        
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket ADD INDEX(id_user_unknown);
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket ADD FOREIGN KEY (id_user_unknown) REFERENCES ens2_user_unknown (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_service_calendar ADD INDEX(id_service);
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_service_calendar ADD FOREIGN KEY (id_service) REFERENCES ens2_ticket_service (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_roleToPermissions ADD INDEX(id_role);
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_roleToPermissions ADD FOREIGN KEY (id_role) REFERENCES ens2_role (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_roleToPermissions ADD FOREIGN KEY (id_permission) REFERENCES ens2_permission (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket_report ADD INDEX(id_call_type);
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket_report ADD INDEX(id_call_result);
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket_report ADD FOREIGN KEY (id_call_type) REFERENCES ens2_call_type (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_ticket_report ADD FOREIGN KEY (id_call_result) REFERENCES ens2_call_result (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_user ADD INDEX (id_role);
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_user ADD INDEX (id_office);
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_user ADD FOREIGN KEY (id_role) REFERENCES ens2_role (id) ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);

        await queryRunner.query(`
            ALTER TABLE ens2_user ADD FOREIGN KEY (id_office) REFERENCES ens2_office (id)ON DELETE RESTRICT ON UPDATE RESTRICT;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return;
    }
}
