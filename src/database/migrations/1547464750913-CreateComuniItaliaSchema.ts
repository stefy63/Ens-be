import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateComuniItaliaSchema1547464750913 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE \`ens2_comuni\` (
                \`id\` int(11) unsigned NOT NULL,
                \`id_regione\` int(11) unsigned NOT NULL,
                \`id_provincia\` int(11) unsigned NOT NULL,
                \`nome\` varchar(255) NOT NULL,
                \`capoluogo_provincia\` tinyint(1) DEFAULT '0',
                \`codice_catastale\` varchar(255) NOT NULL,
                \`latitudine\` decimal(9,6) NOT NULL,
                \`longitudine\` decimal(9,6) NOT NULL,
                PRIMARY KEY (\`id\`),
                KEY \`id_regione\` (\`id_regione\`),
                KEY \`id_provincia\` (\`id_provincia\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                `);

        await queryRunner.query(`
            CREATE TABLE \`ens2_province\` (
                \`id\` int(11) unsigned NOT NULL,
                \`id_regione\` int(11) unsigned NOT NULL,
                \`codice_citta_metropolitana\` int(11) unsigned DEFAULT NULL,
                \`nome\` varchar(255) NOT NULL,
                \`sigla_automobilistica\` varchar(2) NOT NULL,
                \`latitudine\` decimal(9,6) NOT NULL,
                \`longitudine\` decimal(9,6) NOT NULL,
                PRIMARY KEY (\`id\`),
                KEY \`id_regione\` (\`id_regione\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                `);

        await queryRunner.query(`
            CREATE TABLE \`ens2_regioni\` (
                \`id\` int(11) unsigned NOT NULL,
                \`nome\` varchar(255) NOT NULL,
                \`latitudine\` decimal(9,6) NOT NULL,
                \`longitudine\` decimal(9,6) NOT NULL,
                PRIMARY KEY (\`id\`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                `);

        await queryRunner.query(`
            ALTER TABLE \`ens2_comuni\`
                ADD CONSTRAINT \`ens2_comuni_ibfk_1\` FOREIGN KEY (\`id_regione\`) REFERENCES \`ens2_regioni\` (\`id\`),
                ADD CONSTRAINT \`ens2_comuni_ibfk_2\` FOREIGN KEY (\`id_provincia\`) REFERENCES \`ens2_province\` (\`id\`);
        `);

        await queryRunner.query(`
            ALTER TABLE \`ens2_province\`
                ADD CONSTRAINT \`ens2_province_ibfk_1\` FOREIGN KEY (\`id_regione\`) REFERENCES \`ens2_regioni\` (\`id\`);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE \`ens2_comuni\``);
        await queryRunner.query(`DROP TABLE \`ens2_province\``);
        await queryRunner.query(`DROP TABLE \`ens2_regioni\``);
    }

}
