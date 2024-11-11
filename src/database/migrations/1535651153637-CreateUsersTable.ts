import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsersTable1535651153637 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE \`ens2_user_data\`
            (
                \`id\`               INT NOT NULL auto_increment,
                \`name\`             VARCHAR(255) NOT NULL,
                \`surname\`          VARCHAR(255) NOT NULL,
                \`email\`            VARCHAR(255) NOT NULL,
                \`gender\`           VARCHAR(255) NULL,
                \`city\`             VARCHAR(255) NULL,
                \`phone\`            VARCHAR(255) NULL,
                \`card_number\`      INT NULL,
                \`privacyaccept\`    TINYINT NULL,
                \`newsletteraccept\` TINYINT NULL,
                \`becontacted\`      TINYINT NULL,
                PRIMARY KEY(\`id\`)
            )
        `);

        await queryRunner.query(`
            INSERT INTO \`ens2_user_data\` (\`id\`,\`name\`,\`surname\`,\`email\` ) VALUES
            (\'1\',\'Administrator\',\'-\',\'admin@localhost.com\');
        `);

        await queryRunner.query(`
            CREATE TABLE \`ens2_user\` (
                \`id\` int(11) NOT NULL,
                \`id_userdata\` int(11) NOT NULL,
                \`username\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`isOperator\` tinyint(4) NOT NULL DEFAULT '0',
                \`disabled\` tinyint(4) NOT NULL DEFAULT '0',
                \`date_creation\` datetime NOT NULL,
                \`date_update\` datetime DEFAULT NULL,
                \`id_role\` int(11) DEFAULT NULL,
                \`id_office\` int(11) DEFAULT NULL,
                PRIMARY KEY(\`id\`)
                CONSTRAINT uc_user_2nd UNIQUE (username)
            );
        `);

        await queryRunner.query(`
            INSERT INTO \`ens2_user\` (\`id\`,\`id_userdata\`,\`username\`,\`password\`,\`isOperator\`,\`disabled\`,\`date_creation\`,\`id_role\` ) VALUES
            (\'1\',\'1\',\'admin\',\'21232f297a57a5a743894a0e4a801fc3\',\'1\',\'0\', NOW(),\'3\');
        `);


        await queryRunner.query(`
            CREATE TABLE ens2_role (
                id INT NOT NULL auto_increment,
                name VARCHAR(255) NOT NULL,
                description VARCHAR(255) NULL,
                PRIMARY KEY(id)
            )
        `);

        await queryRunner.query(`
            INSERT INTO \`ens2_role\` (\`id\`,\`name\`,\`description\`) VALUES
            (\'1\',\'USER\',\'Role for user\'), (\'2\',\'OPERATOR\',\'Role for operator\'),  (\'3\',\'ADMIN\',\'Role for admin\');
        `);

        await queryRunner.query(`
        CREATE TABLE ens2_permission
        (
            id INT NOT NULL auto_increment,
            action VARCHAR(255) NOT NULL,
            PRIMARY KEY(id)
        )
        `);

        await queryRunner.query(`
            INSERT INTO \`ens2_permission\` (\`id\`,\`action\`) VALUES
            (\'1\',\'ticket.edit.all\'), (\'2\',\'ticket.get.filtered\'), (\'3\',\'ticket.delete\');
        `);


        await queryRunner.query(`
        CREATE TABLE ens2_roleToPermissions
        (
            id_role INT NOT NULL,
            id_permission INT NOT NULL,
            INDEX(id_role, id_permission)
        )
        `);

        await queryRunner.query(`
            INSERT INTO \`ens2_roleToPermissions\` (\`id_role\`,\`id_permission\`) VALUES
            (\'2\',\'1\'), (\'2\',\'2\'), (\'2\',\'3\'), (\'3\',\'1\'), (\'3\',\'2\'), (\'3\',\'3\');
        `);

        await queryRunner.query(`
            CREATE TABLE ens2_office
            (
                id INT NOT NULL auto_increment,
                office VARCHAR(255) NOT NULL,
                PRIMARY KEY(id)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE ens2_user_data`);
        await queryRunner.query(`DROP TABLE ens2_user`);
        await queryRunner.query(`DROP TABLE ens2_role`);
        await queryRunner.query(`DROP TABLE ens2_permission`);
        await queryRunner.query(`DROP TABLE ens2_roleToPermissions`);
        await queryRunner.query(`DROP TABLE ens2_office`);
    }

}
